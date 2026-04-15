/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0109C8",
        secondary: "#1A1A1A",
        "text-light": "#797979",
        heading: "#222224",
        "hero-bg": "#FAFAFF",
        "keep-touch-bg": "#FAFAFE",
        "grey-bg": "#F7F7F7",
        success: "#27AE60",
        warning: "#E2B93B",
        error: "#C94444",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      maxWidth: {
        "container": "1200px",
      },
      borderRadius: {
        "extra": "20px",
      }
    },
  },
  plugins: [],
}


