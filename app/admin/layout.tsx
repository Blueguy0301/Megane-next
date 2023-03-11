"use client"
import type { ReactNode } from "react"
import Navbar from "@components/Navbar"
import Scan from "@components/Scan"
import { SessionProvider } from "next-auth/react"
import { Suspense } from "react"
import Loading from "@components/Loading"
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<Loading />}>
			<Navbar />
			{children}
			<Scan />
		</Suspense>
	)
}
