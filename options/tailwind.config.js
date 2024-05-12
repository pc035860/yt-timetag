/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'sm-light': '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
        light:
          '0 1px 3px 0 rgb(255 255 255 / 0.1), 0 1px 2px -1px rgb(255 255 255 / 0.1);',
        'md-light':
          '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
        'lg-light':
          '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
        'xl-light':
          '0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)',
        '2xl-light': '0 25px 50px -12px rgba(255, 255, 255, 0.25)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
    },
    colors: {
      'timetag-light': '#065fd4',
      'timetag-dark': '#3ea6ff',
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dim'],
  },
};
