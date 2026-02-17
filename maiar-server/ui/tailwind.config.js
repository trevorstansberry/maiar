/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Syne', 'system-ui', 'sans-serif']
      },
      colors: {
        accent: {
          DEFAULT: '#ff630f',
          dark: '#e5550a',
          light: '#ff8147'
        },
        gold: {
          DEFAULT: '#F5A623',
          dark: '#D4891A',
          light: '#F7BE5E'
        }
      },
      backdropBlur: {
        glass: '12px'
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        blink: 'blink 1s step-end infinite',
        'fade-in-up': 'fadeInUp 0.35s ease forwards',
        'skeleton-sweep': 'skeletonSweep 1.5s infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        skeletonSweep: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        }
      }
    }
  },
  plugins: []
}
