import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon, GraduationCapIcon, ShieldIcon, UserIcon, LogOutIcon } from './icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Admission', path: '/admission' },
    { name: 'Success Stories', path: '/stories' },
  ];

  const handleAdminLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-gold-500/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center group-hover:shadow-gold transition-shadow">
              <GraduationCapIcon className="w-6 h-6 text-dark-900" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold gold-text leading-tight">DSM</h1>
              <p className="text-[10px] text-gray-500 leading-tight">Outsourcing & Training</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm transition-colors duration-300 relative group ${
                  location.pathname === link.path
                    ? 'text-gold-400'
                    : 'text-gray-400 hover:text-gold-400'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
            <Link
              to="/student"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              Student Portal
            </Link>
            
            {/* Admin Link - Only visible when authenticated */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <ShieldIcon className="w-4 h-4" />
                  Admin Panel
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Show a lock icon hint for admin (non-clickable for non-authenticated) */
              <div
                className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed"
                title="Admin access required"
              >
                <ShieldIcon className="w-4 h-4" />
                Admin
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-400 hover:text-gold-400 transition-colors"
          >
            {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800/95 backdrop-blur-xl border-b border-gold-500/10"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors ${
                    location.pathname === link.path
                      ? 'text-gold-400'
                      : 'text-gray-400 hover:text-gold-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/student"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 py-2 transition-colors ${
                  location.pathname === '/student'
                    ? 'text-gold-400'
                    : 'text-gray-500 hover:text-gold-400'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Student Portal
              </Link>
              
              {/* Admin Link - Only visible when authenticated on mobile */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors py-2"
                  >
                    <ShieldIcon className="w-4 h-4" />
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors py-2 w-full"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 py-2">
                  <ShieldIcon className="w-4 h-4" />
                  Admin (Login Required)
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
