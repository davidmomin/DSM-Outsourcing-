/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFD966',
          400: '#FFCC33',
          500: '#D4A017',
          600: '#B8860B',
          700: '#996515',
          800: '#7A5012',
          900: '#5C3D0E',
        },
        dark: {
          50: '#2A2A2A',
          100: '#222222',
          200: '#1E1E1E',
          300: '#1A1A1A',
          400: '#151515',
          500: '#111111',
          600: '#0D0D0D',
          700: '#0A0A0A',
          800: '#070707',
          900: '#050505',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A017 0%, #FFD966 50%, #B8860B 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0D0D0D 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 160, 23, 0.3)',
        'gold-lg': '0 0 40px rgba(212, 160, 23, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 160, 23, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 160, 23, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
