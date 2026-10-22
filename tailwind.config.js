/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#090A0C',
          subtle: '#101216',
          muted: '#16181F',
          surface: '#1D2029',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          borderStrong: 'rgba(255, 255, 255, 0.16)'
        },
        ink: {
          DEFAULT: '#F5F6F8',
          secondary: '#B1B5C0',
          muted: '#717684',
          faint: '#434752'
        },
        accent: {
          DEFAULT: '#D4FF00', // Electric lime
          hover: '#C2EB00',
          muted: 'rgba(212, 255, 0, 0.12)',
          border: 'rgba(212, 255, 0, 0.28)'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif']
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter: '-0.02em',
        tight: '-0.01em',
        wide: '0.04em',
        widest: '0.08em'
      }
    },
  },
  plugins: [],
}
