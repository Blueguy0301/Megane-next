"use client"
import type { MouseEventHandler, ReactNode } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
type button = {
	children: ReactNode
	disabled?: any
	[x: string]: any
}
type props =
	| (button & {
			type?: "button" | "submit" | "reset"
			onClick?: MouseEventHandler<HTMLButtonElement>
			className?: string
			children: ReactNode
			disabled?: any
			[x: string]: any
	  })
	| (button & {
			type: "Link"
			href: string
			className?: string
			onClick?: MouseEventHandler
	  })
const Button = (props: props) => {
	const { type, children, href, onClick, className, disabled, ...rest } = props
	//todo : remove this state management. ang panget tignan

	const [isDisabled, setIsDisabled] = useState(false)
	useEffect(() => {
		setIsDisabled(disabled instanceof Function ? disabled() : disabled)
	}, [disabled])
	if (props.type === "Link") {
		return (
			<Link
				href={props.href}
				className={`${props.className ?? ""} button disabled:opacity-50`}
				type="button"
				{...onClick}
			>
				{props.children}
			</Link>
		)
	} else
		return (
			<button
				type={props.type ?? "button"}
				className={`${props.className ?? ""} button`}
				onClick={onClick}
				disabled={isDisabled}
				{...rest}
			>
				{props.children}
			</button>
		)
}

export default Button
