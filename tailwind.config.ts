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
        // Near-monochrome system: ink on paper, one gray band, one blue thread.
        varindo: {
          ink: '#1d1d1f',
          deep: '#474747',
          mid: '#707070',
          paper: '#ffffff',
          canvas: '#f5f5f7',
          wash: '#e8e8ed',
          nav: '#fafafc',
          line: '#d6d6d6',
          blue: '#0071e3',   // filled CTA only
          link: '#0066cc',   // inline link text
          ember: '#b64400',  // "Baru" badge

          // Legacy aliases — old markup lands on the new palette
          cream: '#f5f5f7',
          warm: '#f5f5f7',
          sand: '#d6d6d6',
          muted: '#707070',
          gold: '#0066cc',

          // Grayscale ramp
          50:  '#f5f5f7',
          100: '#f0f0f2',
          200: '#e8e8ed',
          300: '#d6d6d6',
          400: '#86868b',
          500: '#707070',
          600: '#6e6e73',
          700: '#474747',
          800: '#333336',
          900: '#1d1d1f'
        }
      },
      borderRadius: {
        card: '28px',
        xl2: '18px',
        pill: '980px'
      },
      boxShadow: {
        // Cards and bands carry no elevation. Only floating overlays
        // (menus, modals, the chat panel) get a whisper of depth.
        luxury: '0 8px 30px rgba(0, 0, 0, 0.12)',
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
