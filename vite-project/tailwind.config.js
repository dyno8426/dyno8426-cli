/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'scanlines': 'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.4) 50%)',
        'screen-glow': 'radial-gradient(ellipse at center,rgba(255,255,255,0.15) 0%,transparent 70%)',
        'screen-vignette': 'radial-gradient(circle at center,transparent 0%,rgba(0,0,0,0.5) 100%)',
        'pixel-grid-h': 'repeating-linear-gradient(90deg,rgba(255,255,255,0.1) 0px,transparent 1px)',
        'pixel-grid-v': 'repeating-linear-gradient(0deg,rgba(255,255,255,0.1) 0px,transparent 1px)',
      },
      boxShadow: {
        'monitor': '0 0 0 8px #2c2c2c,0 0 0 12px #242424,0 0 32px 12px rgba(0,0,0,0.4)',
        'inner-screen': 'inset 0 0 30px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}
