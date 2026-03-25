/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        primary:"#3B82F6",
        secondary:"#F472B6",
        accent:"#FACC15",
        surface:"#F9FAFB",
        textPrimary:"#1F2937",
        textSecondary:"#6B7280",
      },
    },
  },
  plugins: [],
}


