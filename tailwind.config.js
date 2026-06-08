/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        obsidian: {
          50: '#f7f7f6',
          100: '#e8e7e4',
          200: '#d1cfca',
          300: '#b2afa7',
          400: '#928d84',
          500: '#78736a',
          600: '#625d56',
          700: '#524d47',
          800: '#46413d',
          900: '#3d3935',
          950: '#1a1816',
        },
        champagne: {
          50: '#fdf9ef',
          100: '#faf0d4',
          200: '#f4dfa5',
          300: '#edc96d',
          400: '#e6b040',
          500: '#de9825',
          600: '#c47a1b',
          700: '#a35b19',
          800: '#85481b',
          900: '#6d3c1a',
          950: '#3d1d0b',
        },
        ivory: '#faf8f4',
        slate: {
          850: '#1a2032',
        }
      },
      letterSpacing: {
        'ultra': '0.3em',
        'wide-xl': '0.2em',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
