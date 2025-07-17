import type { Config } from 'tailwindcss'

const config: {
    plugins: (({addUtilities}: { addUtilities: any }) => void)[];
    theme: { extend: {} };
    darkMode: string;
    content: string[]
} = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [
        function({ addUtilities }) {
            addUtilities({
                '.text-gradient': {
                    'background': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                    'background-size': '200% 200%',
                    'animation': 'gradient 3s ease infinite',
                },
                '.glass': {
                    'backdrop-filter': 'blur(10px) saturate(150%)',
                    'background-color': 'rgba(255, 255, 255, 0.05)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                },
                '.glass-dark': {
                    'backdrop-filter': 'blur(10px) saturate(150%)',
                    'background-color': 'rgba(0, 0, 0, 0.2)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                },
                '.scrollbar-hide': {
                    'scrollbar-width': 'none',
                    '-ms-overflow-style': 'none',
                    '&::-webkit-scrollbar': {
                        'display': 'none',
                    },
                },
            })
        },
    ],
}

export default config