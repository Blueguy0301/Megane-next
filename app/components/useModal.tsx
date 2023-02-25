"use client"
import type { MouseEventHandler, ReactNode } from "react"
import { useState } from "react"
import Button from "@components/Button"

type Props = {
	title: string
	children: ReactNode
	onAccept?: MouseEventHandler
	confirmText?: string | number
	hideConfirm?: boolean
	buttonSettings?: { [x: string]: any }
	[x: string]: any
}

const useModal = (opened = false) => {
	const [isOpen, setIsOpen] = useState(opened)
	const handleClick = () => setIsOpen(!isOpen)
	const Open = ({
		onClick,
		className,
		children,
		...rest
	}: {
		className?: string
		onClick?: MouseEventHandler
		children: ReactNode
		[x: string]: any
	}) => (
		<Button
			onClick={(e) => {
				e.preventDefault()
				setIsOpen(!isOpen)
				if (onClick) {
					onClick(e)
				}
			}}
			className={className ?? ""}
			{...rest}
		>
			{children}
		</Button>
	)

	const Modal = (props: Props) => (
		<div
			className={`fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center  bg-black/50  p-4 ${
				isOpen ? "" : "hidden"
			}`}
			onClick={handleClick}
		>
			<div
				className={` max-h-full w-full min-w-0 gap-4 overflow-auto rounded-md bg-slate-700 p-4 md:w-3/5 md:p-5 ${
					props.className && props.className
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex-grow">
					<h2 className="mb-4  ">{props.title}</h2>
					{props.children}
				</div>
				<div className=" flex w-full flex-row justify-center gap-3 md:justify-end">
					{!props.hideConfirm && (
						<Button
							className="green"
							onClick={(e) => {
								if (props.onAccept) props.onAccept(e)

								props.buttonSettings?.handleClick ? null : handleClick()
							}}
							{...props.buttonSettings}
						>
							{props.confirmText ?? "Confirm"}
						</Button>
					)}
					<Button onClick={handleClick} className="red">
						Close
					</Button>
				</div>
			</div>
		</div>
	)

	return { Open, Modal, setIsOpen, isOpen }
}

export default useModal
