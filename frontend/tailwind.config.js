/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zed: {
          orange: '#E85D04',
          'orange-light': '#F48C06',
          'orange-dark': '#DC2F02',
          green: '#2D6A4F',
          'green-light': '#40916C',
          'green-dark': '#1B4332',
          red: '#D00000',
          yellow: '#FFC107',
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          text: '#212529',
          'text-muted': '#6C757D',
          border: '#DEE2E6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 6px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      }
    },
  },
  plugins: [],
}
