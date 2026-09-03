/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':      '#070B14',
        'bg-surface':   '#0E1525',
        'bg-elevated':  '#162035',
        'saffron':      '#F97316',
        'saffron-dim':  '#7C3A0F',
        'india-green':  '#16A34A',
        'green-dim':    '#14532D',
        'crimson':      '#DC2626',
        'crimson-dim':  '#7F1D1D',
        'amber-val':    '#D97706',
        'amber-dim':    '#78350F',
        'text-primary': '#F1F5F9',
        'text-secondary':'#94A3B8',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card':   '12px',
        'btn':    '8px',
        'input':  '6px',
        'pill':   '24px',
      },
      boxShadow: {
        'glow-saffron': '0 0 24px rgba(249,115,22,0.3)',
        'glow-green':   '0 0 24px rgba(22,163,74,0.3)',
        'glow-crimson': '0 0 24px rgba(220,38,38,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'scan':       'scan 2.5s ease-in-out infinite',
        'ping-slow':  'ping 2s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%':   { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
