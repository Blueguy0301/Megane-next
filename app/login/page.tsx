/* eslint-disable react-hooks/rules-of-hooks */
import { authOptions } from "@api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

import { redirect } from "next/navigation"
import Image from "next/image"
import Form from "./Form"
type props = {
	searchParams?: {
		callbackUrl?: string
		error?: string
	}
}
const page = async (props: props) => {
	const session = await getServerSession(authOptions)
	if (session) redirect("/store/dashboard")
	return (
		<div className="page flex flex-col items-center justify-end">
			<Form error={props.searchParams?.error} />
		</div>
	)
}

export default page
