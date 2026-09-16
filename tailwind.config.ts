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
        label: ['var(--font-label)']
      },
      colors: {
        // Gallery wall, half lit: a near-monochrome system where the only
        // colour is the laminate itself. Editorial rhythm comes from
        // alternating paper-white and near-black full-bleed bands.
        varindo: {
          ink: '#1a211e',      // Carbon Ink — headlines, body, hairlines
          deep: '#363537',     // Slate — nav text on light surfaces
          mid: '#606562',      // Graphite — muted body, metadata
          paper: '#ffffff',    // Paper White — the canvas
          canvas: '#eef1f0',   // Fog — soft card / alternating band
          wash: '#e0e0e0',     // Mist — dividers, hover on light chips
          nav: '#ffffff',
          line: '#cccfcd',     // Ash Border — hairline inputs and rules
          obsidian: '#0c0c0c', // Deep Panel — full-bleed dark sections
          pewter: '#4e4e4e',   // supporting neutral, badge fills
          accent: '#1a211e',   // no chromatic CTA — ink is the action tone
          blue: '#1a211e',     // legacy name for the filled CTA
          link: '#1a211e',     // inline link text
          ember: '#cc2e39',    // Ember Red — once per viewport, at most

          // Legacy aliases — old markup lands on the new palette
          cream: '#eef1f0',
          warm: '#eef1f0',
          sand: '#cccfcd',
          muted: '#606562',
          gold: '#1a211e',

          // Grayscale ramp
          50:  '#eef1f0',
          100: '#eef1f0',
          200: '#e0e0e0',
          300: '#cccfcd',
          400: '#606562',
          500: '#606562',
          600: '#4e4e4e',
          700: '#363537',
          800: '#1a211e',
          900: '#1a211e'
        }
      },
      borderRadius: {
        // Two radii carry the whole system: 8 for cards and images,
        // 4 for buttons, inputs and nav. Pills are badges and filter chips.
        card: '8px',
        xl2: '4px',
        pill: '9999px'
      },
      boxShadow: {
        // There is no z-axis here. Only floating overlays (menus, the chat
        // panel) get any depth at all, and even then it is a hairline.
        luxury: '0 1px 0 rgba(26, 33, 30, 0.12), 0 8px 24px rgba(26, 33, 30, 0.08)',
        card: 'none',
        'card-hover': 'none',
        'inset-top': 'none'
      },
      letterSpacing: {
        label: '0.038em',
        'label-lg': '0.057em',
        'widest-xl': '0.25em',
        'widest-2xl': '0.32em'
      }
    }
  },
  plugins: []
};

export default config;
