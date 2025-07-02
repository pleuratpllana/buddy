/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
      extend: {
        fontFamily: {
          sans: ["Inter", "sans-serif"],
        },
        fontSize: {
          h1: "var(--font-size-h1)",
          h2: "var(--font-size-h2)",
          h3: "var(--font-size-h3)",
          p: "var(--font-size-p)",
        },
        colors: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          accent: "var(--color-accent)",
          backgroundLight: "var(--color-background-light)",
          black: "var(--color-black)",
          white: "var(--color-white)",
          subtlegray: "var(--subtle-gray-accent)",
        },
      },
    },
    plugins: [],
  };