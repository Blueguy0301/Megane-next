"use client"
import { ReactNode, Suspense } from "react"
import Navbar from "@components/Navbar"
import Scan from "@components/Scan"
import loading from "./loading"
import { SessionProvider } from "next-auth/react"
export default function RootLayout({
	children,
	session,
}: {
	children: ReactNode
	session: any
}) {
	return (
		<SessionProvider session={session}>
			<Navbar />
			{children}
			<Scan />
		</SessionProvider>
	)
}
