/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")
const nextConfig = {
	//! should always be on. but scanner is being initialized twice
	reactStrictMode: false,
	swcMinify: true,
	experimental: {
		appDir: true,
	},
}
const pwa = withPWA({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development",
})
module.exports = pwa(nextConfig)
