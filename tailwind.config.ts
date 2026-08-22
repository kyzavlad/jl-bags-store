import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111827',
          foreground: '#ffffff',
        },
      },
      // Editorial storefront tokens used by the JL Bags redesign.
      opacity: {
        12: '0.12',
        38: '0.38',
        42: '0.42',
        52: '0.52',
        58: '0.58',
        62: '0.62',
        88: '0.88',
      },
      spacing: {
        13: '3.25rem',
      },
    },
  },
  plugins: [],
}

export default config
