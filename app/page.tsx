import { getServerSession } from "next-auth"
import React from "react"
import Button from "@components/Button"
import { authOptions } from "@api/auth/[...nextauth]"
const page = async () => {
	const session = await getServerSession(authOptions)
	return (
		<div className="page">
			{session && (
				<>
					<Button type="Link" href="/store/dashboard" className="m-auto">
						Dashboard
					</Button>
					<Button type="Link" href="/store/inventory" className="m-auto">
						Inventory
					</Button>
				</>
			)}
			{!session && (
				<Button type="Link" href="/login">
					Login
				</Button>
			)}
		</div>
	)
}

export default page
