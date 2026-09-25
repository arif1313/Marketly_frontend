import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        marketly: {
          "primary": "#4F46E5",
          "primary-content": "#ffffff",
          "secondary": "#F97316",
          "secondary-content": "#ffffff",
          "accent": "#0D9488",
          "accent-content": "#ffffff",
          "neutral": "#1E1B4B",
          "neutral-content": "#E5E7EB",
          "base-100": "#FFFFFF",
          "base-200": "#F5F5FF",
          "base-300": "#E7E5FF",
          "base-content": "#1F2333",
          "info": "#0EA5E9",
          "success": "#16A34A",
          "warning": "#F59E0B",
          "error": "#DC2626",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
        },
      },
    ],
    darkTheme: "marketly",
  },
}
