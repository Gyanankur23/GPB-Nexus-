/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx}',
    './utils/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
