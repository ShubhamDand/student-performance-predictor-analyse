/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#7C3AED',
        secondary: '#14B8A6',
        accent: '#F97316',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.04)',
        'hover': '0 8px 24px rgba(124,58,237,0.12)',
        'glow': '0 0 8px rgba(124,58,237,0.5)',
      },
      backdropBlur: {
        'glass': '24px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
