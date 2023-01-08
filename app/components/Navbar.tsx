"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import type { MouseEvent } from "react"

const Navbar = () => {
	const checkSize = (e?: UIEvent) => {
		const width = window.innerWidth
		console.log(width)
		if (width >= 768) {
			setModalOptions(false)
			setNavOptions(true)
		} else {
			setModalOptions(true)
			setNavOptions(false)
		}
	}
	const name = "Robert"
	useEffect(() => {
		checkSize()
		const listener = window.addEventListener("resize", checkSize)
		return () => {
			window.removeEventListener("resize", checkSize)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const handleDropdown = (e: MouseEvent<HTMLElement>) => {
		setIsShown(!isShown)
		e.preventDefault()
		console.log("dropdown")
	}
	const handleClick = (e: MouseEvent<HTMLElement>) => {
		e.preventDefault()
		console.log("submitted")
	}

	const [isShown, setIsShown] = useState(false)
	const [darkMode, setDarkMode] = useState(true)
	const [navOptions, setNavOptions] = useState<boolean>()
	const [modalOptions, setModalOptions] = useState<boolean>()
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
						<Link className="nav-button" href="/profile">
							Logout
						</Link>
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
