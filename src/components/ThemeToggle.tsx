import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, MonitorIcon } from './icons';
import { useTheme } from '../lib/theme';

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'auto', label: 'Auto', icon: MonitorIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'light', label: 'Light', icon: SunIcon },
  ] as const;

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-400/50 border border-gold-500/10 hover:border-gold-500/30 transition-all text-gray-400 hover:text-gold-400"
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="text-xs hidden sm:inline">{currentTheme.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 bg-dark-800 border border-gold-500/20 rounded-xl overflow-hidden shadow-xl z-50"
          >
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActive 
                      ? 'bg-gold-500/10 text-gold-400' 
                      : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.value === 'auto' && (
                    <span className="text-xs text-gray-600 ml-auto">
                      {actualTheme === 'dark' ? '🌙' : '☀️'}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
