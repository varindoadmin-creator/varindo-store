import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)']
      },
      colors: {
        // Warm neutrals plus one clay accent. The interface owns no
        // other hue — every colour on screen should be a laminate.
        varindo: {
          ink: '#17150f',
          deep: '#4a453a',
          mid: '#78715f',
          paper: '#fbfaf8',
          canvas: '#f2efe9',
          wash: '#e7e2d7',
          nav: '#fbfaf8',
          line: '#ded7c8',
          'line-firm': '#c9c0ad',

          // Clay, in two tones of one hue: the fill tone carries white
          // at 5.1:1, the ink tone carries link text on the recessed
          // band at 5.6:1 where the fill tone would only reach 4.4:1.
          clay: '#b0532a',
          'clay-deep': '#8e411f',
          'clay-ink': '#99461f',
          'clay-wash': '#f7ede6',

          accent: '#b0532a',
          blue: '#b0532a',   // legacy name for the accent (filled CTAs)
          link: '#99461f',   // inline link text
          ember: '#b0532a',  // "Baru" badge

          // Legacy aliases — old markup lands on the new palette
          cream: '#f2efe9',
          warm: '#f2efe9',
          sand: '#ded7c8',
          muted: '#78715f',
          gold: '#99461f',

          // Warm grayscale ramp. 400 matches `mid` rather than sitting
          // lighter: its only call sites are placeholder text and small
          // captions, and a lighter step there fails AA on paper.
          50:  '#f6f4ef',
          100: '#f2efe9',
          200: '#e7e2d7',
          300: '#ded7c8',
          400: '#78715f',
          500: '#78715f',
          600: '#5f594b',
          700: '#4a453a',
          800: '#2d2a21',
          900: '#17150f'
        }
      },
      borderRadius: {
        card: '16px',
        xl2: '12px',
        ctl: '8px',
        pill: '980px'
      },
      boxShadow: {
        // Structure is hairlines, not elevation. Only genuinely
        // floating overlays (menus, modals, the chat panel) lift.
        luxury: '0 12px 32px rgba(23, 21, 15, 0.14)',
        card: 'none',
        'card-hover': 'none',
        'inset-top': 'none'
      },
      letterSpacing: {
        'widest-xl': '0.25em',
        'widest-2xl': '0.32em'
      }
    }
  },
  plugins: []
};

export default config;
