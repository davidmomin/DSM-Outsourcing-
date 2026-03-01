import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './lib/theme';
import { AuthProvider } from './lib/auth';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CoursesPage from './pages/CoursesPage';
import AdmissionPage from './pages/AdmissionPage';
import StoriesPage from './pages/StoriesPage';
import NotFound from './pages/NotFound';
import UserDashboard from './pages/UserDashboard';
import Loader from './components/Loader';
import GlobalBackground from './components/GlobalBackground';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Simulate initial loading/branding period
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isHomePage && <GlobalBackground />}
      <AnimatePresence mode="wait">
        {loading && <Loader />}
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid rgba(212, 160, 23, 0.3)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/student" element={<UserDashboard />} />
        {/* Admin route handles its own authentication - shows login if not authenticated */}
        <Route path="/admin" element={<Admin />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
