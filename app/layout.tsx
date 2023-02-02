"use client"
import type { ReactNode } from "react"
import Head from "./Head"
import "../styles/global.css"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
	children,
	session,
}: {
	children: ReactNode
	session: any
}) {
	return (
		<html lang="en">
			<Head title={"test"} />
			<body className="bg-slate-900">
				<SessionProvider session={session}>{children}</SessionProvider>
			</body>
		</html>
	)
}
