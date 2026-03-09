/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        nb: {
          bg: '#1a1a2e',
          surface: '#222240',
          panel: '#2a2a4a',
          border: '#000000',
          accent: '#facc15',      // Bold yellow
          green: '#4ade80',
          red: '#f43f5e',
          amber: '#fb923c',
          purple: '#a78bfa',
          cyan: '#22d3ee',
          text: '#f5f5f5',
          'text-dim': '#a1a1aa',
          muted: '#71717a',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-accent': '4px 4px 0px 0px #facc15',
        'brutal-inset': 'inset 2px 2px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
