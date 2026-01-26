/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D4A3A',
          light: '#747F64',
          dark: '#2D3629',
        },
        accent: {
          DEFAULT: '#CB7A5B',
          light: '#E8DDD4',
          hover: '#984A16',
        },
        sage: {
          DEFAULT: '#889B76',
          light: '#A8B89A',
          dark: '#6B7D5E',
        },
        slate: {
          DEFAULT: '#5C757A',
          light: '#788B90',
        },
        cream: {
          DEFAULT: '#E8E2D8',
          light: '#F5F3EF',
          dark: '#D4CFC5',
        },
        ivory: '#E3D6C5',
        background: '#F5F3EF',
        card: '#FFFFFF',
        muted: '#5C757A',
        danger: '#B94A3D',
        warning: '#D4A039',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
