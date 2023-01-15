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
			},
			keyframes: {
				slideIn: {
					'0%': { transform: 'translateX(-2.5rem)' },
					'100%': { transform: 'translateX(0px)' }
				},
				progress: {
					'0%': { width: '100%' },
					'100%': { width: '0%' },
				}
			},
			animation: {
				'slideIn': 'slideIn 0.3s forwards ease-in-out',
				'progress': 'progress 7s forwards linear'
			}
		},
	},
	plugins: [],
}
