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
	let sw: ServiceWorkerContainer | undefined
	if (typeof window !== "undefined") {
		sw = window?.navigator?.serviceWorker
	}

	useEffect(() => {
		if (sw) {
			sw.register("/sw.js", { scope: "/" })
				.then((registration) => {
					console.log(
						"Service Worker registration successful with scope: ",
						registration.scope
					)
				})
				.catch((err) => {
					console.log("Service Worker registration failed: ", err)
				})
		}
	}, [sw])

	return (
		<html lang="en">
			<Head title={"Megane"} />
			<body className="bg-slate-900">
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	)
}
