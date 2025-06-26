/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to scan all JS/JSX/TS/TSX files in src
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#1a1a2e',
        lightblue: '#007bff',
        graytext: '#a0a0a0',
        lightpurple: '#d7c7f3',
        darkpurple: '#8a2be2',
        lightorange: '#fcd34d',
        beige: '#f5f5dc',
      },
      fontFamily: {
        bagoss: ['BagossStandard', 'Arial', 'sans-serif'], // Define your custom font here
        inter: ['Inter', 'sans-serif'], // Keep this if you still use Inter
      },
    },
  },
  plugins: [],
}