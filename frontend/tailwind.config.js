/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Premium Enterprise Palette - Mapped to CSS Vars
            colors: {
                'navy-deep': 'var(--bg-primary)',
                'navy-light': 'var(--bg-secondary)',
                'medical-cyan': 'var(--accent-primary)',
                'cyan-neon': 'var(--accent-primary)',
                'life-cyan': 'var(--accent-glow)',
                'cyan-glow': 'var(--accent-glow)',
                'alert-red': 'var(--accent-alert)',
                'glass-border': 'var(--glass-border)',
                'glass-bg': 'var(--glass-bg)',
                // Keep static alerts
                'alert-dark': '#7f1d1d',
                'success-green': '#10b981',
                'warning-amber': '#f59e0b',
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
