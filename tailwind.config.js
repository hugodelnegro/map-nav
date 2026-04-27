/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: Only scan your specific project folders
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};