/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      'timetag-light': '#065fd4',
      'timetag-dark': '#3ea6ff',
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['pastel', 'dim'],
  },
};
