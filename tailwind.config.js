/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      width: {
        '1/7': '14.2857143%', // 100% / 7
        '2/7': '28.5714286%', // 2 * 100% / 7
        '3/7': '42.8571429%', // 3 * 100% / 7
        '4/7': '57.1428571%', // 4 * 100% / 7
        '5/7': '71.4285714%', // 5 * 100% / 7
        '6/7': '85.7142857%', // 6 * 100% / 7
        '1/8': '12.5%',       // 1/8 width
        '2/8': '25%',         // 2/8 width
        '3/8': '37.5%',       // 3/8 width
        '4/8': '50%',         // 4/8 width
        '5/8': '62.5%',       // 5/8 width
        '6/8': '75%',         // 6/8 width
        '7/8': '87.5%',       // 7/8 width
      },
      screens: {
        'xs': '480px',  // Extra small devices (phones)
        'sm': '640px',  // Small devices (tablets)
        'md': '768px',  // Medium screens (small laptops)
        'lg': '1280px', // Large screens (desktops)
        'xl': '1536px', // Extra large screens
        '2xl': '1536px', // Very large screens
      },
    },
  },
  plugins: [],
};
