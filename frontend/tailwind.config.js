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
        "void": "#050505",
        "surface-100": "#121212",
        "surface-200": "#1e1e1e",
        "surface-300": "#2a2a2a",
        "primary": "#f20d33",
        "primary-glow": "rgba(242, 13, 51, 0.5)",
      },
      fontFamily: {
        "display": ["Be Vietnam Pro", "sans-serif"],
        "sans": ["Be Vietnam Pro", "sans-serif"],
      },
      borderRadius: {
        "md": "0.75rem", // 12px
        "lg": "1.5rem", // 24px
      },
      animation: {
        "spotlight": "spotlight 2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        spotlight: {
          "0%": { opacity: 0.5, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1.1)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
}
