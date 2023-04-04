"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { MouseEvent } from "react"
import { signOut } from "next-auth/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faSun } from "@fortawesome/free-solid-svg-icons"
//todo : rework.
const NavbarClient = () => {
	const [isShown, setIsShown] = useState(false)
	const [navOptions, setNavOptions] = useState<boolean>()
	const [modalOptions, setModalOptions] = useState<boolean>()
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
		window.addEventListener("resize", checkSize)
		return () => window.removeEventListener("resize", checkSize)
	}, [])
	const handleDropdown = (e: MouseEvent<HTMLElement>) => {
		console.log("clicked dropdown")
		setIsShown(!isShown)
		e.preventDefault()
	}
	return (
		<>
			<div className="mr-auto flex select-none flex-row items-center gap-4 p-4">
				<Image src="/Logo.png" alt="Logo" width={90} height={64} decoding="sync" />
				<h3>Megane</h3>
			</div>

			{/* navigation */}
			<div className="btn-group select-none">
				{isShown && (
					<div className="dropdown absolute">
						{modalOptions && (
							<>
								<Link
									className="nav-button"
									href="/store/dashboard"
									onClick={() => setIsShown(false)}
								>
									Home
								</Link>
								<Link
									className="nav-button"
									href="/store/inventory"
									onClick={() => setIsShown(false)}
								>
									Inventory
								</Link>
							</>
						)}
						<Link
							className="nav-button"
							href="/store/settings"
							onClick={() => setIsShown(false)}
						>
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
						<Link className="nav-button" href="/store/dashboard">
							Home
						</Link>
						<Link className="nav-button" href="/store/inventory">
							Inventory
						</Link>
					</>
				)}
				<button type="button" onClick={handleDropdown} className="nav-button">
					<FontAwesomeIcon icon={faCaretDown} size="1x" />
				</button>
			</div>
		</>
	)
}

export default NavbarClient
