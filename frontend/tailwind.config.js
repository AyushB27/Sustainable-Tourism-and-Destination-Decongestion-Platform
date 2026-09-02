/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Indian Government Official Color Palette
        gov: {
          saffron: '#FF9933',
          'saffron-dark': '#E67E00',
          green: '#138808',
          'green-dark': '#0E6606',
          navy: '#0C2340',
          'navy-dark': '#071629',
          'navy-light': '#1A365D',
          gold: '#D4AF37',
          'gold-light': '#FDF8E2',
          maroon: '#800000',
          cream: '#FCFBF7',
          light: '#F4F6F9',
          border: '#D1D5DB'
        },
        dcc: {
          optimal: '#138808',   // India green
          moderate: '#D97706',  // Amber yellow
          critical: '#DC2626',  // Alert red
          'optimal-bg': '#F0FDF4',
          'moderate-bg': '#FFFBEB',
          'critical-bg': '#FEF2F2',
        },
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Noto Sans Devanagari', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
