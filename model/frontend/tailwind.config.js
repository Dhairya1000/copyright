/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', /* slate-900 */
        card: '#1e293b', /* slate-800 */
        primary: '#3b82f6', /* blue-500 */
        secondary: '#6366f1', /* indigo-500 */
      }
    },
  },
  plugins: [],
}
