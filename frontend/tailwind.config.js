/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        peach: '#FFDAB9',
        lightyellow: '#FFF5C3',
        accent: '#007BFF'
      }
    }
  },
  plugins: []
}
