/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,tsx,jsx,ts}'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
}
