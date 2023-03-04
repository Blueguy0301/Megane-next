"use client"
import type { ReactNode } from "react"
import Head from "./Head"
import "../styles/global.css"

export default function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<html lang="en">
			<Head title={"Megane"} />
			<body className="bg-slate-900">{children}</body>
		</html>
	)
}
