const { fontFamily } = require('tailwindcss/defaultTheme')
const { nextui } = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        fontFamily: {
            sans: ['var(--font-open-sans)', ...fontFamily.sans],
            mono: [...fontFamily.mono],
        },
        extend: {},
    },
    darkMode: 'class',
    plugins: [
        require('@headlessui/tailwindcss')({ prefix: 'ui' }),
        require('@tailwindcss/typography'),
        nextui()
    ],
    safelist: [
        'fst-italic',
        'fs-small',
        'text-decoration-underline',
        'text-primary',
        'sticky-top',
    ]
}
