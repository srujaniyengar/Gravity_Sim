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
          bg: '#1e1e32',          // Lighter dark background
          surface: '#2d2d4a',     // Distinct surface color
          panel: '#3b3b5c',       // Brighter panel for contrast 
          border: '#000000',
          accent: '#fbbf24',      // Brighter, warmer yellow
          green: '#34d399',       // More vibrant green
          red: '#fb7185',         // Softer, more visible red
          amber: '#fb923c',
          purple: '#c084fc',      // Lighter purple
          cyan: '#22d3ee',
          text: '#ffffff',        // Pure white for highest contrast
          'text-dim': '#d4d4d8',  // Brighter gray for dim text
          muted: '#a1a1aa',       // Visible muted text
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
