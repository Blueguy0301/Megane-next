"use client"
import { ReactNode } from "react"
import { useState } from "react"
import Button from "./Button"

type Props = {
	title: string
	children: ReactNode
	[x: string]: any
}

const useModal = () => {
	const [isOpen, setIsOpen] = useState(false)
	const handleClick = () => setIsOpen(!isOpen)
	const Open = () => (
		<Button
			onClick={(e) => {
				e.preventDefault()
				setIsOpen(!isOpen)
			}}
		>
			Test button
		</Button>
	)
	const Modal = (props: Props) => (
		<div
			className={`fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-4 ${
				isOpen ? "" : "hidden"
			}`}
			onClick={handleClick}
		>
			<div
				className={` max-h-full w-full min-w-0 overflow-auto rounded-md bg-slate-700 p-4 md:w-3/5 ${
					props.className && props.className
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex-grow">
					<h2 className="mb-4 text-2xl font-bold">{props.title}</h2>
					{props.children}
				</div>
				<div className=" flex w-full flex-row justify-center gap-3 md:justify-end">
					<Button className="green">for onAccept</Button>
					<Button onClick={handleClick} className="red">
						Close
					</Button>
				</div>
			</div>
		</div>
	)

	return { Open, Modal }
}

export default useModal
