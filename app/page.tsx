/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import Button from "@components/Button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
type userData = {
	userName?: string
	password?: string
}
const page = () => {
	const { data: session } = useSession()
	return (
		<div>
			<Button type="Link" href="/login">
				Login
			</Button>
		</div>
	)
}
export default page
