/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nueva paleta Vive Silver - Inspirada en naturaleza
        primary: {
          DEFAULT: '#3D4A3A',  // Verde bosque oscuro
          light: '#747F64',    // Olive Green
          dark: '#2D3629',     // Verde más oscuro
        },
        accent: {
          DEFAULT: '#CB7A5B',  // Terracotta
          light: '#E8DDD4',    // Almond Cream claro
          hover: '#984A16',    // Burnt Sienna
          muted: '#D4A589',    // Terracotta claro
        },
        sage: {
          DEFAULT: '#889B76',  // Sage Green
          light: '#A8B89A',
          dark: '#6B7D5E',
        },
        slate: {
          DEFAULT: '#5C757A',  // Slate Blue
          light: '#788B90',    // Stormy Sky
        },
        cream: {
          DEFAULT: '#E8E2D8',  // Almond Cream
          light: '#F5F3EF',    // Background
          dark: '#D4CFC5',
        },
        ivory: '#E3D6C5',      // Ivory Sand
        background: '#F5F3EF',
        card: '#FFFFFF',
        muted: '#6B7280',
        border: '#E8E2D8',
        danger: '#B94A3D',     // Rojo terracota
      },
      fontFamily: {
        sans: ['Gilroy', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Baskervville', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
