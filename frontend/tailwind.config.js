/** @format */

module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'f5': "#f5f5f5",
        gray: "#7f7f7f",
        'gray-2' : "#414141",
        'gray-3': '#545454',
        'gray-4': '#292929',
        'gray-5': '#999',
        'gray-6': '#f5f5f5',
        'gray-7': '#ebebeb',
        'gray-8': '#e7e9eb',
        'red-1': '#e33d3d',
        'black-1': 'rgba(0,0,0,0.7)',
      },
      fontSize: {
        10: "10px",
        14: "14px",
        15: "15px",
      },
      lineHeight: {
        22: "22px",
      },
      spacing: {
        "10px": "10px",
        "15px": "15px",
        "500px": "500px",
      },
      backgroundImage: {
        'secondary': "url('/src/assets/images/bg_policy.jpg')",
        'line-bottom': "url('/src/assets/images/line-bottom.PNG')",
        'footer': "url('/src/assets/images/pattern_dark.png')",
        'banner-1': "url('/src/assets/images/banner-1.jpg')",
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
        'color-secondary': "#292929",
      }),
      gridTemplateColumns: {
        // Simple 16 column grid
       '2-60-40': '60% 40%',
       '2-20-80': '20% 80%',
       '2-10-90': '10% 90%',
       '2-30-70': '30% 70%',
      },
      zIndex: {
        '1000': 1000,
      }
    
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
