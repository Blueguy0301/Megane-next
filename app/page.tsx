import { getServerSession } from "next-auth"
import React from "react"
import Button from "@components/Button"
import { authOptions } from "@api/auth/[...nextauth]"
import Image from "next/image"
import logo from "@public/Logo.png"
const page = async () => {
	const session = await getServerSession(authOptions)
	return (
		<div className="page flex-col">
			{/* Navbar */}
			<div className=" flex bg-blue-700 px-4 py-2">
				<span className="flex flex-col items-center">
					<h3>Megane</h3>
					<h4 className="text-xs">眼鏡</h4>
				</span>
				<div className="ml-auto mr-10">
					{session && (
						<Button type="Link" href="/store/dashboard" className="m-auto">
							Dashboard
						</Button>
					)}
					{!session && (
						<Button type="Link" href="/login">
							Login
						</Button>
					)}
				</div>
			</div>
			{/* Hero */}
			<div className="page flex-grow flex-wrap items-center justify-center p-4">
				<div className="left mr-5 flex flex-grow flex-col items-end max-md:items-center">
					<Image src={logo} alt="Logo" />
				</div>
				<div className="right flex-grow">
					<h1 className="max-sm:text-center">Megane</h1>
					<h3 className="max-sm:text-center">Self hosted Point of sales system</h3>
					<p className="max-sm:text-center">Created by Ice Cream... </p>
				</div>
				<div className="mt-auto flex w-full justify-center gap-4">
					<Button type="Link" href="https://github.com/Blueguy0301/Megane-next">
						View Repository
					</Button>
					<Button type="Link" href="https://github.com/Blueguy0301/Megane-next#megane">
						Documentation
					</Button>
				</div>
			</div>
			{/* About Megane */}
			<div className="page flex-grow flex-wrap items-center justify-center p-4">
				<div className="right flex-grow">
					<h1 className="max-sm:text-center">About</h1>
					{/* <h3 className="max-sm:text-center"></h3> */}
					{/* <p className="max-sm:text-center">Created by Ice Cream... </p> */}
				</div>
				<div className="mt-auto flex w-full justify-center gap-4">
					<Button type="Link" href="https://github.com/Blueguy0301/Megane-next">
						View Repository
					</Button>
					<Button type="Link" href="https://github.com/Blueguy0301/Megane-next#megane">
						Documentation
					</Button>
				</div>
			</div>
		</div>
	)
}

export default page
