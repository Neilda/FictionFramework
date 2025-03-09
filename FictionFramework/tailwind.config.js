/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'novelry': {
          50: '#f7f7f7',
          100: '#e9e9ea',
          200: '#d4d4d6',
          300: '#b7b7ba',
          400: '#8e8e93',
          500: '#717176',
          600: '#5c5c61',
          700: '#4c4c50',
          800: '#414144',
          900: '#3a3a3c',
          950: '#242425',
        },
        'accent': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        'serif': ['Crimson Text', 'Georgia', 'serif'],
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};