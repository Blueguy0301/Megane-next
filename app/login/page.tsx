/* eslint-disable react-hooks/rules-of-hooks */
import { authOptions } from "@api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Image from "next/image"
import Form from "./Form"
const page = async () => {
	//! change this when a neww update  comes.
	const session = await unstable_getServerSession(authOptions)
	console.log(session)
	if (session) redirect("/store/dashboard")
	return (
		<div className="page flex flex-col items-center justify-end">
			<Form />
		</div>
	)
}

export default page
