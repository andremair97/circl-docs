import type { Config } from 'tailwindcss';

// Tailwind configuration providing Circl theme tokens.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2e7d32',
        bg: '#f5f5f4',
        surface: '#ffffff',
        'soft-border': '#e5e7eb',
        ok: '#16a34a',
        warn: '#f59e0b',
        bad: '#dc2626',
      },
    },
  },
  plugins: [],
} satisfies Config;
