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
        primary: {
          navy: '#1E3A8A',
          blue: '#3B82F6',
          emerald: '#10B981',
        },
        background: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

