module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brand-red-darkest': '#F20530',
        'brand-red': '#F20544',
        'brand-pink': '#F2BBC5',
        'brand-green': '#012619',
        'brand-black': '#0D0D0D'
      }
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [],
}
