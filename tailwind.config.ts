import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        
        // 주요 색상별로 분리
        gray: {
          default: "#D9D9D9",       // 디폴트 그레이
          light: "#f6f6f6",      // 밝은 회색
        },
        
        // 단일 주요 색상들
        primary: "#4F4F4F",      // 딥그레이
        secondary: "#FFE8A3",    // 연한 노란색
        error: "#ED1C24",        // 빨간색 red
      },
    },
  },
  plugins: [],
} satisfies Config;