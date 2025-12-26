/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  // 🔥 Force Tailwind to ALWAYS generate these classes
  safelist: [
    "animate-popLeft",
    "animate-popRight",
    "animate-popBottom",
    "animate-popBottomRight",
    "opacity-0",
  ],

  theme: {
    extend: {
      fontFamily: {
        poppins: ["REM", "Reem Kufi", "sans-serif"],
      },

      keyframes: {
        popLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-30px) scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0) scale(1)",
          },
        },
        popRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(30px) scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0) scale(1)",
          },
        },
        popBottom: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px) scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        popBottomRight: {
          "0%": {
            opacity: "0",
            transform: "translate(30px, 30px) scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0, 0) scale(1)",
          },
        },
      },

      animation: {
        popLeft: "popLeft 0.6s ease-out forwards",
        popRight: "popRight 0.7s ease-out forwards",
        popBottom: "popBottom 0.8s ease-out forwards",
        popBottomRight: "popBottomRight 0.9s ease-out forwards",
      },
    },
  },

  plugins: [],
};