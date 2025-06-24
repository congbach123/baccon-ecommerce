// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom Color Palette - Modern Black & White
      colors: {
        // Primary blacks
        black: "#000000",
        coal: "#1a1a1a",
        charcoal: "#262626",
        "slate-dark": "#404040",

        // Grays
        "gray-900": "#0f0f0f",
        "gray-800": "#1f1f1f",
        "gray-700": "#2f2f2f",
        "gray-600": "#525252",
        "gray-500": "#737373",
        "gray-400": "#a3a3a3",
        "gray-300": "#d4d4d4",
        "gray-200": "#e5e5e5",
        "gray-100": "#f5f5f5",
        "gray-50": "#fafafa",

        // Pure whites
        white: "#ffffff",
        "off-white": "#fcfcfc",
        cream: "#f9f9f9",

        // Accent colors (minimal, for highlights)
        accent: {
          50: "#f8f8f8",
          100: "#f0f0f0",
          500: "#666666",
          900: "#1a1a1a",
        },
      },

      // Typography
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Monaco",
          "Inconsolata",
          "Roboto Mono",
          "monospace",
        ],
        display: ["Cal Sans", "Inter", "SF Pro Display", "sans-serif"],
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.16" }],
        "6xl": ["3.75rem", { lineHeight: "1.12" }],
        "7xl": ["4.5rem", { lineHeight: "1.11" }],
        "8xl": ["6rem", { lineHeight: "1.08" }],
        "9xl": ["8rem", { lineHeight: "1.05" }],
      },

      // Modern spacing scale
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },

      // Box shadows for modern depth
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        large: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },

      // Border radius for modern aesthetics
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      // Animation & transitions
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },

      // Typography utilities
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
    },
  },
  plugins: [
    // Add any additional plugins you need
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
  ],
};
