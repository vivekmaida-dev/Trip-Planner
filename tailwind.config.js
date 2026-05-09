/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#080c14',
        'bg-card': '#0f1623',
        'bg-elevated': '#161f30',
        'border-subtle': '#1e2d45',
        'accent-blue': '#3d8ef0',
        'accent-orange': '#f97316',
        'accent-green': '#22c55e',
        'accent-purple': '#a855f7',
        'accent-yellow': '#eab308',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#475569',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
}
