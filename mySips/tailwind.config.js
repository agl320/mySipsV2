/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["General Sans", "sans-serif"],
                wide: ["Moliga DEMO", "sans-serif"],
            },
            colors: {
                "background-dark": "#121312",
                ["background-block"]: "#1c1c1c",
                "background-light": "#262626",
                ["secondary-light"]: "#e1e1fe",
                ["pastel-orange"]: "#ff844b",
                ["pastel-pink"]: "#ff5466",
                ["white-blue"]: "#eef5ff",
                ["pastel-blue"]: "#528bff",
                ["pastel-purple"]: "#d152ff",
                ["pastel-green"]: "#54ff54",
                ["pastel-yellow"]: "#f2ef3f",
                orange: "#e0ad14",
                ["pastel-light-orange"]: "#ffc04b",
            },
            backgroundImage: {
                overview: "url('/images/overview.webp')",
                "card-add": "url('/images/landing-card-1.webp')",
                "card-stats": "url('/images/landing-card-2.webp')",
                "card-groups": "url('/images/landing-card-3.webp')",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
