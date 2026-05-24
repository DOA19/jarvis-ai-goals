import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-rajdhani)', 'sans-serif'],
        mono: ['var(--font-share-tech)', 'monospace'],
        body: ['var(--font-nunito)', 'sans-serif']
      },
      colors: {
        hud: 'var(--hud)',
        panel: 'var(--panel)',
        panel2: 'var(--panel2)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        accent3: 'var(--accent3)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
        jarvisText: 'var(--text)',
        muted: 'var(--muted)'
      }
    }
  },
  plugins: []
};

export default config;
