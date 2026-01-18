/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dxnGreen: "#1f7a3a",
        dxnGold: "#c4a14a"
      }
    }
  },
  plugins: []
};
