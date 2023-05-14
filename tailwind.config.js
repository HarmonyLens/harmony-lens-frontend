/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        main: "inset 0px -30px 0px 0px #24293E",
      },
      backgroundColor: {
        main: "radial-gradient(110% 50% at bottom, transparent 50%, lightblue 51%)",
      },
      backgroundImage: {
        main: "radial-gradient(110% 70% at bottom, transparent 50%, #24293e 51%, #9B1DE1 52%)",
      },
    },
  },
  plugins: [],
};
