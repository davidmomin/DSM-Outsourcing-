import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmail, 
  signOut as supabaseSignOut, 
  getCurrentUser, 
  getSession,
  onAuthStateChange,
  isSupabaseConfigured,
  supabase,
  type SupabaseUser
} from './supabase';

// Legacy token key for backward compatibility
const TOKEN_KEY = 'dsm_admin_token';
const LEGACY_USER_KEY = 'dsm_admin_user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: SupabaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isLoading: boolean;
  isSupabaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(isSupabaseConfigured());

  // Check for legacy auth (backward compatibility)
  const checkLegacyAuth = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const legacyUser = localStorage.getItem(LEGACY_USER_KEY);
    
    if (token) {
      // Migrate legacy auth to new system if Supabase is configured
      if (isSupabaseConfigured()) {
        // Clear legacy auth - will need to re-login with Supabase
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(LEGACY_USER_KEY);
        return false;
      }
      return true;
    }
    return false;
  };

  const checkAuth = async () => {
    setIsLoading(true);
    
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        // Fall back to legacy auth
        const hasLegacyAuth = checkLegacyAuth();
        setIsAuthenticated(hasLegacyAuth);
        setIsSupabaseReady(false);
        setIsLoading(false);
        return;
      }

      setIsSupabaseReady(true);
      
      // Try to get current session from Supabase
      const session = await getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        });
        setIsAuthenticated(true);
      } else {
        // Check for legacy auth as fallback
        const hasLegacyAuth = checkLegacyAuth();
        setIsAuthenticated(hasLegacyAuth);
        if (!hasLegacyAuth) {
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      // Check for legacy auth as fallback
      const hasLegacyAuth = checkLegacyAuth();
      setIsAuthenticated(hasLegacyAuth);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      if (!isSupabaseConfigured()) {
        // Legacy login for backward compatibility
        // In production, this should validate against your backend
        const mockToken = btoa(`${email}:${password}:${Date.now()}`);
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(LEGACY_USER_KEY, JSON.stringify({ email, role: 'admin' }));
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const { user: supabaseUser, session } = await signInWithEmail(email, password);
      
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          user_metadata: supabaseUser.user_metadata,
        });
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      throw new Error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Clear Supabase session if configured
      if (isSupabaseConfigured()) {
        await supabaseSignOut();
      }
      
      // Clear legacy auth
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_USER_KEY);
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    checkAuth();
    
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
          });
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      checkAuth, 
      isLoading,
      isSupabaseReady 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return { isAuthenticated, isLoading };
}
