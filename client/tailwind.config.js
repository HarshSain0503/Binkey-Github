/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        'primary-100': 'blue',
        'primary-200' : 'purple',
        'secondary-100': 'skyblue',
        'secondary-200' : 'cyan',
        'tertiary-100': 'green',
        'tertiary-200' : '#ffbf00',
        'quaternary-100': 'pink',
        'quaternary-200' : 'red',
      },
    },
  },
  plugins: [],
}

