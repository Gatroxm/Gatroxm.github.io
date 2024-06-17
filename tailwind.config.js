/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: '0 2px 14px 0px rgb(239 239 160)',
      },
      colors: {
        one: 'var(--gamr-color-one)',
        two: 'var(--gamr-color-two) ',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
}