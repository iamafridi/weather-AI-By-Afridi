/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#07101e',
        bg2:     '#0b1628',
        bg3:     '#0f1e35',
        bg4:     '#132540',
        accent:  '#2af5c8',
        accent2: '#0ea5e9',
        accent3: '#7c3aed',
        wtext:   '#e2eaf5',
        wtext2:  '#a8c0d8',
        muted:   '#6b8aaa',
        muted2:  '#3a5570',
        wred:    '#f87171',
        wgreen:  '#4ade80',
        wyellow: '#fbbf24',
        worange: '#fb923c',
        wpurple: '#a78bfa',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '14px',
        xl3: '20px',
      },
      boxShadow: {
        glow:     '0 0 24px rgba(42,245,200,0.15)',
        'glow-sm':'0 0 12px rgba(42,245,200,0.10)',
        glass:    '0 4px 32px rgba(0,0,0,0.40)',
        card:     '0 2px 12px rgba(0,0,0,0.30)',
      },
      animation: {
        float:        'float 4s ease-in-out infinite',
        shimmer:      'shimmer 1.5s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow':  'spin 1.2s linear infinite',
        'slide-up':   'slideUp 0.4s ease both',
        'fade-in':    'fadeIn 0.4s ease both',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(42,245,200,0.4)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(42,245,200,0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
