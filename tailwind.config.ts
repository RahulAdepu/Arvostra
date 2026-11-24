import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--arv-page)",
        paper: "var(--arv-paper)",
        ink: "var(--arv-ink)",
        muted: "var(--arv-muted)",
        rule: "var(--arv-rule)",
        deep: "var(--arv-deep)",
        "deep-ink": "var(--arv-deep-ink)",
        "deep-muted": "var(--arv-deep-muted)",
        gold: "var(--arv-gold)",
        lilac: "var(--arv-lilac)",
        "lilac-ink": "var(--arv-lilac-ink)",
        accent: "var(--arv-accent)",
        "accent-ink": "var(--arv-accent-ink)",
        good: "var(--arv-good)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter-tight)",
          "var(--font-inter)",
          "Inter Tight",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
