/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        raceRed: '#e10600'
      },
      boxShadow: {
        neon: '0 0 18px rgba(225, 6, 0, 0.55)'
      },
      animation: {
        pulseSlow: 'pulse 4s ease-in-out infinite',
        drift: 'drift 7s ease-in-out infinite'
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' }
        }
      }
    }
  },
  plugins: []
}
