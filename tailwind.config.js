import { COLORS, FONTS, SPACING, RADIUS } from './src/design-system/tokens.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: COLORS,
      fontFamily: {
        ui: [FONTS.ui],
        display: [FONTS.display],
        mono: [FONTS.mono],
      },
      spacing: SPACING,
      borderRadius: {
        card: RADIUS.card,
        btn: RADIUS.btn,
      },
      boxShadow: {
        'glow-cyan': '0 0 0 1px var(--accent-cyan), 0 0 24px rgba(34, 211, 238, 0.25)',
        'glow-violet': '0 0 0 1px var(--accent-violet), 0 0 24px rgba(167, 139, 250, 0.25)',
      }
    },
  },
  plugins: [],
}
