// import withMT from "@material-tailwind/react/utils/withMT";

// export default withMT({
//   content: [
//     "./index.html",
//     "./src/**/*.{vue,js,ts,jsx,tsx}",
//     "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
//     "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     screens: {
     
//       sm: "640px",
//       md: "768px",
//       lg: "1024px",
//       xl: "1280px",
//       "2xl": "1536px",
//       c500: "500px",
//       custom400: "400px",
//       custom300: "300px",
     
//     },
//     extend: {},
//   },
//   plugins: [],
// });


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      custom800:"800px",
      lg: "1024px",
      xl: "1320px",
      "2xl": "1536px",
      c500: "500px",
      custom450: "450px",
      custom400: "400px",
      custom300: "300px",
    },
    extend: {},
  },
  plugins: [],
};






