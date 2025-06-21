/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/server/views/**/*.ejs",
    "./src/client/public/**/*.html",
    "./src/client/public/js/**/*.js"    // agar Tailwind scan file EJS
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDD0',
        brown: '#8B4513'
      },
      fontFamily: {
        elegant: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}

