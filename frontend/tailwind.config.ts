import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sanjeevani color palette - warm earthy tones
        primary: {
          50: '#fef7ed',
          100: '#fdedda',
          200: '#fde9b8',
          300: '#fde195',
          400: '#fbd468',
          500: '#f8c635',
          600: '#f5a708',
          700: '#d98c02',
          800: '#b56c02',
          900: '#914c01',
        },
        // Buyer dashboard cooler tones
        buyer: {
          50: '#f0f7ff',
          100: '#d9e9ff',
          200: '#bad4ff',
          300: '#88bcff',
          400: '#55a3ff',
          500: '#3389ff',
          600: '#1d70e6',
          700: '#144da6',
          800: '#0f3d7a',
          900: '#0b2d54',
        },
        // Status colors for log console
        status: {
          searching: '#f59e0b', // amber
          negotiating: '#3b82f6', // blue
          success: '#22c55e', // green
          blocked: '#ef4444', // red
        },
        // Risk tiers
        risk: {
          fresh: '#22c55e',
          slight: '#84cc16',
          moderate: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        },
        // NGO green
        ngo: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'typewriter': 'typewriter 1s steps(30, end)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        typewriter: {
          to: { width: '100%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config