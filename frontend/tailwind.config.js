/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
];
export const theme = {
    extend: {
        colors: {
            primary: {
                50: '#f0f4ff',
                100: '#e5edff',
                200: '#cddbfe',
                300: '#b4c6fc',
                400: '#8b5cf6',
                500: '#667eea',
                600: '#5a67d8',
                700: '#4c51bf',
                800: '#434190',
                900: '#3c366b',
            }
        },
        fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        },
    },
};
export const plugins = [];
