"use client"
import type { ReactNode } from "react"
import Head from "./Head"
import Navbar from "@components/Navbar"
import "../styles/global.css"
import Scan from "@components/Scan"
import { SessionProvider, useSession } from "next-auth/react"

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<Head title={"test"} />
			<body className="bg-slate-900">
				<SessionProvider>
					<Navbar />
					{children}
					<Scan />
				</SessionProvider>
			</body>
		</html>
	)
}
