"use client"
import type { ReactNode } from "react"
import { useEffect } from "react"
import Head from "./Head"
import "../styles/global.css"
import { SessionProvider } from "next-auth/react"
import type { Workbox } from "workbox-window"

declare global {
	interface Window {
		workbox: Workbox
	}
}
export default function RootLayout({ children }: { children: ReactNode }) {
	useEffect(() => {
		if ("serviceWorker" in navigator && window.workbox !== undefined) {
			const wb = window.workbox
			wb.register()
		}
	}, [])

	return (
		<html lang="en">
			<Head title={"Megane"} />
			<body className="bg-slate-900">
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	)
}
