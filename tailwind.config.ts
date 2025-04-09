// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          100: "oklch(var(--primary-100) / <alpha-value>)",
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
      },
    },
  },
  content: ["./app/**/*.{ts,tsx,js,jsx,html}"],
};
export default config;
