module.exports = {
  mode: "jit",
  purge: [
    "./src/index.html",
    "./src/index.js",
    "./src/css/*.css"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
