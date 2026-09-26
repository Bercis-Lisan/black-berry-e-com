/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'apple-blue': '#0071e3',
        'link-blue': '#0066cc',
        'signal-blue': '#2997ff',
        'carbon': '#1d1d1f',
        'frost': '#f5f5f7',
        'ice': '#f4f8fb',
        'smoke': '#333333',
        'graphite': '#474747',
        'ash': '#707070',
        'mist': '#858585',
        'onyx': '#000000',
        'pebble': '#e2e2e5',
        'border-gray': '#d2d2d7',
      },
      fontFamily: {
        display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        text: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'pill': '980px',
      },
      letterSpacing: {
        'apple-tight': '-0.022em',
        'apple-body': '-0.016em',
        'apple-subhead': '-0.0105px',
        'apple-display': '0.616px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}