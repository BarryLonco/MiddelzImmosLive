
import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#0ea5b3', dark: '#0b8590' } },
      borderRadius: { '2xl': '1rem' },
      boxShadow: { soft: '0 6px 24px rgba(0,0,0,0.06)' }
    }
  },
  plugins: []
} satisfies Config
