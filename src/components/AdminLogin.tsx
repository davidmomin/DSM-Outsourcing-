import { useState } from 'react';
import { motion } from 'framer-motion';
import { LockIcon, UserIcon, Loader2Icon, EyeIcon, EyeOffIcon, AlertTriangleIcon } from './icons';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  
  const { login, isSupabaseReady } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Enter both email and password');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/5 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.05, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Configuration Warning */}
      {!isSupabaseConfigured() && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 z-50"
        >
          <div className="max-w-md mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-200">
              <p className="font-semibold mb-1">Supabase Not Configured</p>
              <p className="text-amber-200/70 text-xs">
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file for secure authentication. 
                Using fallback mode for now.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card p-8 md:p-10 w-full max-w-md relative z-10"
      >
        {/* Animated Border Gradient */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-gold-500/0 via-gold-500/30 to-gold-500/0 rounded-[2rem] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center mb-4 shadow-gold"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <LockIcon className="w-8 h-8 text-dark-900" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold gold-text">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">DSM Outsourcing & Computer Training</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Email Address</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
              <input
                type="email"
                placeholder="admin@example.com"
                className="input-field pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
            <div className="relative group">
              <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-field pl-11 pr-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gold-400 transition-colors"
              >
                {showPw ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="gold-btn w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2Icon className="w-5 h-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Security notice */}
        <div className="mt-6 p-3 bg-dark-800/50 rounded-xl border border-gold-500/10">
          <p className="text-center text-xs text-gray-500">
            🔒 Secure admin access only. Unauthorized access is prohibited and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
