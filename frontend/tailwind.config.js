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
        // This is where you add your custom font
        bagoss: ['BagossStandard', 'sans-serif'], // 'bagoss' is the utility class name (e.g., font-bagoss)
        // You can also add other custom fonts here if needed
        // inter: ['Inter', 'sans-serif'], // If you want to use font-inter via Tailwind
      },
    },
  },
  plugins: [],
}