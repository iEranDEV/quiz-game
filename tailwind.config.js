/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
    	"./pages/**/*.{js,ts,jsx,tsx}",
    	"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					100: '#778da9',
					200: '#415a77',
					300: '#273652',
					400: '#0d1b2a',
				}
			},
			boxShadow: {
				'DEFAULT': '0 5px 0 0',
			}
		},
	},
	plugins: [],
}
