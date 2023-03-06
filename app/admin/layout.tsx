"use client"
import type { ReactNode } from "react"
import Navbar from "@components/Navbar"
import Scan from "@components/Scan"
import { SessionProvider } from "next-auth/react"
export default function RootLayout({ children }: { children: ReactNode; session: any }) {
	return (
		<SessionProvider>
			<Navbar />
			{children}
			<Scan />
		</SessionProvider>
	)
}
