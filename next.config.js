/** @type {import('next').NextConfig} */
const nextConfig = {
	//! should always be on. but scanner is being initialized twice
	reactStrictMode: false,
	swcMinify: true,
	experimental: {
		appDir: true,
	},
}

module.exports = nextConfig
