/** @type {import('tailwindcss').Config} */
module.exports = {
  // Add "./app/**/*.{js,jsx,ts,tsx}" and any other folders with components
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./InteractiveMap.tsx", 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};