// import type { Config } from "tailwindcss";
// import plugin from "tailwindcss/plugin";

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//       },
//       fontFamily: {
//         sans: ["var(--font-geist-sans)"],
//         mono: ["var(--font-geist-mono)"],
//       },
//     },
//   },
//   plugins: [
//     plugin(function ({ addUtilities }) {
//       addUtilities({
//         ".no-scrollbar": {
//           "-ms-overflow-style": "none",
//           "scrollbar-width": "none",
//         },
//         ".no-scrollbar::-webkit-scrollbar": {
//           display: "none",
//         },
//       });
//     }),
//   ],
// };
// export default config;

import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    }),
  ],
};
export default config;
