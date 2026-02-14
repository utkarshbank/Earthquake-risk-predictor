import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                midnight: "#0B0E14",
                navy: {
                    900: "#121721",
                    800: "#1A2230",
                },
                cyan: {
                    DEFAULT: "#00FFD1",
                    muted: "rgba(0, 255, 209, 0.15)",
                },
                gold: {
                    DEFAULT: "#D4AF37",
                    muted: "rgba(212, 175, 55, 0.4)",
                },
                seismic: {
                    blue: "#3b82f6",
                    orange: "#f59e0b",
                    red: "#ef4444",
                },
            },
            boxShadow: {
                'elegant': '0 20px 50px -12px rgba(0, 0, 0, 0.8)',
                'cyan': '0 0 25px rgba(0, 255, 209, 0.2)',
                'gold': '0 0 20px rgba(212, 175, 55, 0.15)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'seismic-glow': 'radial-gradient(circle at center, rgba(0, 255, 209, 0.15) 0%, transparent 70%)',
                'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
