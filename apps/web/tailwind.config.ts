import type { Config } from 'tailwindcss';

// Tailwind configuration scoped to the web app. Only scans the app and src folders
// so incremental builds remain fast.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // Circl green used across the UI.
        },
      },
    },
  },
  plugins: [],
};

export default config;
