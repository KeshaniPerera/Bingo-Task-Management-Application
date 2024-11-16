/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"

  ],
  theme: {
    extend: {
      fontFamily: {
        topics: ['"Almarai"', 'sans-serif'],
      },
      colors: {
        lightPurple: '#e8d4f7',
        darkPurple: '#8a31d0',
        mediumPurple: '#634ee3'
      },
    },
  },
  plugins: [],
}

