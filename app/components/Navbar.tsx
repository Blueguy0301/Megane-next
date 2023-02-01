"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import type { MouseEvent } from "react"
import { signOut, useSession } from "next-auth/react"
//todo : rework.
const Navbar = () => {
	const { data: session } = useSession()
	const checkSize = (e?: UIEvent) => {
		const width = window.innerWidth
		if (width >= 768) {
			setModalOptions(false)
			setNavOptions(true)
		} else {
			setModalOptions(true)
			setNavOptions(false)
		}
	}
	useEffect(() => {
		checkSize()
		const listener = window.addEventListener("resize", checkSize)
		return () => window.removeEventListener("resize", checkSize)
	}, [])
	const handleDropdown = (e: MouseEvent<HTMLElement>) => {
		setIsShown(!isShown)
		e.preventDefault()
	}
	const handleClick = (e: MouseEvent<HTMLElement>) => {
		//search
		e.preventDefault()
	}
	const [isShown, setIsShown] = useState(false)
	const [darkMode, setDarkMode] = useState(true)
	const [navOptions, setNavOptions] = useState<boolean>()
	const [modalOptions, setModalOptions] = useState<boolean>()
	if (!session) return <></>
	return (
		<div className="nav  flex w-full bg-blue-700">
			<div className="mr-auto flex flex-row items-center gap-4 p-4">
				<Image src="/Logo.png" alt="Logo" width={90} height={64} decoding="sync" />
				<h3>Megane</h3>
			</div>
			{/* search */}
			{navOptions && (
				<div className="search-bar">
					<input type="search" name="s" id="search" />
					<button type="submit" onClick={handleClick} className="search-btn">
						<Image src="/search.svg" alt="Logo" width={30} height={30} />
					</button>
				</div>
			)}
			{/* navigation */}
			<div className="btn-group ">
				{isShown && (
					<div className="dropdown absolute">
						{modalOptions && (
							<>
								<Link className="nav-button" href="/dashboard">
									Dashboard
								</Link>
								<Link className="nav-button" href="/inventory">
									Inventory
								</Link>
							</>
						)}
						<Link className="nav-button" href="/profile">
							Settings
						</Link>
						<button
							type="button"
							className="nav-button text-left"
							onClick={() => signOut()}
						>
							Logout
						</button>
					</div>
				)}
				{navOptions && (
					<>
						<Link className="nav-button" href="/dashboard">
							Dashboard
						</Link>
						<Link className="nav-button" href="/inventory">
							Inventory
						</Link>
					</>
				)}
				<button type="button" onClick={handleDropdown} className="nav-button">
					<Image src="/down.svg" height={23} width={14} alt="Dropdown" />
				</button>
			</div>
			{/* theme */}
			<div className="theme">
				<button type="button">
					<Image src="/light.svg" height={30} width={30} alt="theme switch" />
				</button>
			</div>
		</div>
	)
}

export default Navbar
