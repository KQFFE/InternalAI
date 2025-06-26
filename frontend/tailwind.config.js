/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
        beige: '#f5f5dc',
        darkblue: '#1a1a2e',
        lightblue: '#3182ce',
        lightorange: '#FFE7D9', // This is the color for the footer background
      },
      fontFamily: {
        // If you want a specific font for 'knowit' or body, define it here.
        // For now, it defaults to sans-serif as per style.css.
        // For example, if you add Inter via Google Fonts or locally:
        // inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}