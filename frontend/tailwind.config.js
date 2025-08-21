/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f5f8',
          100: '#eceaf1',
          200: '#d9d6e3',
          300: '#c0bccf',
          400: '#a298b7',
          500: '#85799e',
          600: '#6b5f85',
          700: '#584e6d',
          800: '#463e58',
          900: '#383146',
        },
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(8px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
      animation: {
        fadeIn: 'fadeIn .5s ease-out both',
        slideUp: 'slideUp .4s ease-out both',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}


