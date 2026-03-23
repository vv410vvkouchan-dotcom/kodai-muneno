import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1115',
        panel: '#1a1e24',
        line: '#2a2f37',
      },
    },
  },
  plugins: [],
} satisfies Config;
