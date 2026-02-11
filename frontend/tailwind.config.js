/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#f20d33",
        "background-light": "#f8f5f6",
        "background-dark": "#0a0a0a",
        "card-dark": "#1a1a1a",
        "border-dark": "#2a2a2a",
        "surface-dark": "#1d0e10",
      },
      fontFamily: {
        "display": ["Be Vietnam Pro", "sans-serif"],
        "sans": ["Be Vietnam Pro", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
