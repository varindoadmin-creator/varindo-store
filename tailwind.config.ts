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
        display: ['var(--font-display)']
      },
      colors: {
        // Achromatic system: ink on paper, Mist for banding, Fog hairlines.
        // No accent hue — the laminate photography is the only colour.
        varindo: {
          ink: '#1a1a1a',
          deep: '#262626',
          mid: '#666666',
          paper: '#ffffff',
          canvas: '#f2f2f2',
          wash: '#e6e6e6',
          nav: '#ffffff',
          line: '#e6e6e6',
          accent: '#262626', // Charcoal — every filled control
          blue: '#262626',   // legacy name for the accent (filled CTAs)
          link: '#1a1a1a',   // inline link text
          ember: '#1a1a1a',  // legacy badge tone, now ink

          // Legacy aliases — old markup lands on the new palette
          cream: '#f2f2f2',
          warm: '#f2f2f2',
          sand: '#e6e6e6',
          muted: '#666666',
          gold: '#262626',

          // Grayscale ramp
          50:  '#f2f2f2',
          100: '#f2f2f2',
          200: '#e6e6e6',
          300: '#e6e6e6',
          400: '#999999',
          500: '#666666',
          600: '#666666',
          700: '#262626',
          800: '#262626',
          900: '#1a1a1a'
        }
      },
      borderRadius: {
        card: '12px',  // images and media plates
        xl2: '8px',    // controls, menus
        pill: '8px',   // buttons
        nav: '16px'    // the hamburger container
      },
      boxShadow: {
        // Shadowless. Floating overlays (menus, modals, the chat panel)
        // get a drawn Fog frame instead of blur-based elevation.
        luxury: '0 0 0 1px #e6e6e6',
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
