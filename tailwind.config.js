/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        cream: '#F8F4EC',
        luxury: {
          black: '#111111',
          dark: '#1a1a1a',
          gray: '#6b6b6b',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #B8960C 100%)',
        'dark-gradient': 'linear-gradient(135deg, #111111 0%, #2a2a2a 100%)',
      },
      boxShadow: {
        luxury: '0 8px 32px rgba(212, 175, 55, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.08)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
