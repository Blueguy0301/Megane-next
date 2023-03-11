import Navbar from "@components/Navbar"
import type { ReactNode } from "react"
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
