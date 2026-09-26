/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A192F",
          50: "#EEF3FA",
          100: "#DCE7F5",
          200: "#B9CDEB",
          300: "#8FADDD",
          400: "#5F87C7",
          500: "#3B66A8",
          600: "#2C5088",
          700: "#213E6B",
          800: "#16305A",
          900: "#0D2137",
          950: "#0A192F",
        },
        vermilion: {
          DEFAULT: "#E6490E",
          50: "#FFF3EC",
          100: "#FFE4D3",
          200: "#FFC7A6",
          300: "#FFA478",
          400: "#FF7E47",
          500: "#FF5A1F",
          600: "#E6490E",
          700: "#C73B09",
          800: "#9C2E05",
          900: "#7A2404",
        },
        brandblue: {
          DEFAULT: "#2F7DE1",
          50: "#EBF3FD",
          100: "#D6E7FB",
          200: "#ADD0F7",
          300: "#7DB3F0",
          400: "#5495E9",
          500: "#2F7DE1",
          600: "#1E63C4",
          700: "#1A4F9E",
          800: "#163F7C",
          900: "#132F5B",
        },
        gold: {
          DEFAULT: "#D97706",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,25,47,.05), 0 4px 16px -2px rgba(10,25,47,.08)",
        lift: "0 12px 32px -8px rgba(10,25,47,.22)",
        glow: "0 0 0 3px rgba(230,81,0,.18)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "fade-up": "fade-up .6s cubic-bezier(.22,1,.36,1) both",
      },
      backgroundImage: {
        "grid-navy":
          "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
