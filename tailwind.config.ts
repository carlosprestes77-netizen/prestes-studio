import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#0a0a0b",
          900: "#111113",
          800: "#18181b",
          700: "#27272a",
          600: "#3f3f46",
          500: "#52525b",
          400: "#71717a",
          300: "#a1a1aa",
          200: "#d4d4d8",
          100: "#f4f4f5",
        },
        gold: {
          DEFAULT: "#c9a96e",
          light: "#e8d5b0",
          dark: "#8b6914",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
