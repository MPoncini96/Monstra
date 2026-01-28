/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./js/**/*.js",
    "./monsters/**/*.html",
    "./src/**/*.{js,html}",
    "./node_modules/preline/dist/*.js"
  ],
  theme: { extend: {} },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
