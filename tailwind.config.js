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
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",    // Navy blue
        secondary: "#581c87",  // Dark purple
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#1e3a8a",    // Navy blue
          secondary: "#581c87",  // Dark purple
          base100: "#0f172a",    // Very dark slate
          base200: "#1e293b",    // Dark slate
          base300: "#334155",    // Medium slate
          "base-content": "#f1f5f9", // Light text
        }
      }
    ],
  },
};
