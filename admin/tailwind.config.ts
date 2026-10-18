import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        '68': '17rem',
        '76': '19rem',
        '88': '22rem',
      },
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#17365D',
          600: '#132C4C',
          700: '#0F233C',
          800: '#0B1A2C',
          900: '#07101C',
          DEFAULT: '#17365D',
        },
        primary: {
          blue: '#2563EB',
          navy: '#17365D',
          DEFAULT: '#2563EB',
        },
        surface: {
          light: '#FFFFFF',
          subtle: '#F5F7FA',
          border: '#E2E8F0',
        },
        textColor: {
          primary: '#172033',
          secondary: '#64748B',
        },
        status: {
          success: '#15803D',
          warning: '#B45309',
          danger: '#B91C1C',
        }
      },
    },
  },
  plugins: [],
};
export default config;
