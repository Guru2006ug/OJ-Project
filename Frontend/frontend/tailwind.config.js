/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",        // Indigo-500 - matches the UI gradient
        secondary: "#8b5cf6",      // Violet-500 - purple accent
        tertiary: "#a855f7",       // Purple-500 - deeper purple
        accent: "#3b82f6",         // Blue-500 - complementary blue
        dark: "#0f172a",           // Slate-900 - darker background
        "dark-light": "#1e293b",   // Slate-800 - lighter dark
        "gradient-start": "#6366f1", // Indigo-500
        "gradient-middle": "#8b5cf6", // Violet-500  
        "gradient-end": "#a855f7",   // Purple-500
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        'button-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
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
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.2)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
