/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'navy-deep': '#0f172a',
                'teal-dark': '#134e4a',
                'life-cyan': '#06b6d4',
                'medical-cyan': '#06b6d4',
                'medical-navy': '#0f172a',
                'emergency-red': '#ef4444',
            },
            fontFamily: {
                sans: ['Inter', 'Public Sans', 'sans-serif'],
            },
            backdropBlur: {
                'xs': '2px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
