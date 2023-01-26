module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      boxShadow: {
        solid: "-4px -4px 0 0 rgba(0,255,0, 1)",
      },
    },
  },
  plugins: [],
};
