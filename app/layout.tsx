"use client"
import type { ReactNode } from "react"
import { useEffect } from "react"
import Head from "./Head"
import "../styles/global.css"
import { SessionProvider } from "next-auth/react"
import type { Workbox } from "workbox-window"
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<Head title={"Megane"} />
			<body className="bg-slate-900">
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	)
}
