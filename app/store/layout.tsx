"use client"
import type { ReactNode } from "react"
import Navbar from "@components/Navbar"
import Scan from "@components/Scan"
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			{children}
			<Scan />
		</>
	)
}
