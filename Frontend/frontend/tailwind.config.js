/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6d28d9",        // A nice deep purple (violet-700)
        secondary: "#8b5cf6",      // A slightly lighter purple (violet-500)
        tertiary: "#a78bfa",       // A soft lavender (violet-400)
        accent: "#38bdf8",         // A bright sky blue for contrast (lightBlue-400)
        dark: "#111827",           // A darker gray (gray-900)
        "dark-light": "#1f2937",   // A lighter dark gray (gray-800)
        "gradient-start": "#6d28d9",
        "gradient-middle": "#8b5cf6",
        "gradient-end": "#a78bfa",
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(109, 40, 217, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        'button-gradient': 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
        'dark-gradient': 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(109, 40, 217, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(109, 40, 217, 0.3)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(109, 40, 217, 0.2)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
