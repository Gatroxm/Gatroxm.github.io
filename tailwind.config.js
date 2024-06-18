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
        one_pacity: 'var(--gamr-color-one-opacity) ',
        two: 'var(--gamr-color-two) ',
        two_opacity: 'var(--gamr-color-two-opacity) ',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
}