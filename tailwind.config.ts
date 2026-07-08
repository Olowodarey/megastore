import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#666666", // Text color from Figma
        primary: {
          DEFAULT: "#008ECC", // Primary color from Figma
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F7F7F7",
          foreground: "#222222", // Heading color from Figma
        },
        accent: {
          DEFAULT: "#FFD300", // Yellow badge color
          foreground: "#222222",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#666666", // Text color
        },
        heading: "#222222", // Dedicated heading color
        text: "#666666", // Dedicated text color
        border: "#E5E5E5",
        input: "#E5E5E5",
        ring: "#008ECC",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
