"use client"
import { ReactNode, Suspense } from "react"
import Navbar from "@components/Navbar"
import Scan from "@components/Scan"
import Loading from "./Loading"
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			<Suspense fallback={<Loading />}>{children}</Suspense>
			<Scan />
		</>
	)
}
