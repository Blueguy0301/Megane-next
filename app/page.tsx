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
	const router = useRouter()
	if (!session) void router.push("/login")
	return <div>Logged in as {session?.user.userName}</div>
}

export default page
