/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./monsters/**/*.html",

    "./v2/**/*.html",
    "./v2/**/*.js",

    "./js/**/*.js",
    "./src/**/*.{js,html}",

    "./node_modules/preline/dist/*.js"
  ],
  theme: { extend: {} },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
