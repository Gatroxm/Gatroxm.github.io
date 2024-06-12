/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: '0 2px 14px 0px rgba(250,250,250,250.10)',
      },
      colors: {
        one: 'var(--gamr-color-one)',
        two: 'var(--gamr-color-two) ',
        three: 'var(--gamr-color-three)',
        four: 'var(--gamr-color-four)',
        five: 'var(--gamr-color-five)',
        six: 'var(--gamr-color-six)',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
}