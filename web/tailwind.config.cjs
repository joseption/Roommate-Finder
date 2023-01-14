/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      lineClamp: {
        8: "8",
        10: "10",
        12: "12",
        14: "14",
        16: "16",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    // require("@headlessui/tailwindcss")({ prefix: "ui" }),
  ],
};
