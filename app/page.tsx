import { getServerSession } from "next-auth"
import React from "react"
import Button from "@components/Button"
import { authOptions } from "@api/auth/[...nextauth]"
const page = async () => {
	const session = await getServerSession(authOptions)
	return (
		<div className="page flex-col">
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
			<h1>Lorem ipsum dolor sit amet.</h1>
			<h2>Lorem ipsum dolor sit amet.</h2>
			<h3>Lorem ipsum dolor sit amet.</h3>
			<h4>Lorem ipsum dolor sit amet.</h4>
			<p>Lorem ipsum dolor sit amet.</p>
		</div>
	)
}

export default page
