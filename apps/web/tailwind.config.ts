import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-heebo)', 'sans-serif'],
      },
      colors: {
        background: '#1d1b35',
        surface: '#242048',
        border: '#2e2a5e',
        accent: {
          DEFAULT: '#b59016',
          hover: '#9a7b12',
          muted: '#b5901620',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          disabled: '#4B5563',
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.4)',
        modal: '0 20px 60px 0 rgba(0,0,0,0.6)',
        gold: '0 0 20px rgba(181,144,22,0.3)',
      },
    },
  },
  plugins: [],
}

export default config