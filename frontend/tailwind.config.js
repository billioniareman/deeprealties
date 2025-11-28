/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Luxury Gold Palette
        gold: {
          50: '#FDF9EF',
          100: '#F9EFD5',
          200: '#F2DCAA',
          300: '#E9C574',
          400: '#DBA94C',
          500: '#C9A962',
          600: '#B8923E',
          700: '#996F32',
          800: '#7D592E',
          900: '#674A29',
          950: '#3A2614',
        },
        champagne: {
          50: '#FDFBF7',
          100: '#F9F4E8',
          200: '#F3E9D1',
          300: '#E9D6AF',
          400: '#DCBD85',
          500: '#D4AF37',
          600: '#C09B2D',
          700: '#A07D25',
          800: '#836424',
          900: '#6C5221',
          950: '#3D2C0F',
        },
        // Rich Dark Palette
        onyx: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#454545',
          900: '#1A1A1A',
          950: '#0D0D0D',
        },
        // Warm Ivory/Cream
        ivory: {
          50: '#FEFDFB',
          100: '#FDFBF5',
          200: '#F9F5EA',
          300: '#F5F0E8',
          400: '#EDE5D6',
          500: '#E2D5BF',
          600: '#D4C4A8',
          700: '#C4B08C',
          800: '#A69270',
          900: '#8A7759',
          950: '#493E2E',
        },
        // Rose Gold Accents
        rosegold: {
          400: '#E8B4A0',
          500: '#D4A190',
          600: '#C08E7C',
        },
        // Legacy compatibility
        primary: {
          navy: '#0D0D0D',
          blue: '#C9A962',
          emerald: '#D4AF37',
        },
        background: '#FDFBF5',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['4rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'parallax': 'parallax 1s ease-out forwards',
        'reveal': 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'line-grow': 'lineGrow 1s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(201, 169, 98, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        parallax: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        reveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        lineGrow: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A962 0%, #D4AF37 50%, #E9C574 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.4), transparent)',
        'dark-gradient': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
        'luxury-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #2A2A2A 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FDFBF5 0%, #F5F0E8 100%)',
        'hero-pattern': 'radial-gradient(ellipse at 50% 0%, rgba(201, 169, 98, 0.15) 0%, transparent 50%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(201, 169, 98, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(20, 184, 166, 0.1) 0px, transparent 50%)',
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(201, 169, 98, 0.1)',
        'luxury-lg': '0 35px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(201, 169, 98, 0.15)',
        'gold': '0 10px 40px -10px rgba(201, 169, 98, 0.4)',
        'gold-lg': '0 20px 60px -15px rgba(201, 169, 98, 0.5)',
        'inner-gold': 'inset 0 0 20px rgba(201, 169, 98, 0.1)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
