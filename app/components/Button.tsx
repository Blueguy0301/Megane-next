"use client"
import type { MouseEventHandler, ReactNode } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
type propsTest = {
	type?: "button" | "submit" | "reset" | undefined | "Link"
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined
	className?: string
	children: ReactNode
	disabled?: any
	[x: string]: any
}
const Button = (props: propsTest) => {
	const { type, children, href, onClick, className, disabled, ...rest } = props
	const [isDisabled, setIsDisabled] = useState(false)
	useEffect(() => {
		setIsDisabled(disabled instanceof Function ? disabled() : disabled)
	}, [disabled])

	if (props.type === "Link") {
		return (
			<Link href={props.href} className={`${props.className ?? ""} button`} type="button">
				{props.children}
			</Link>
		)
	}
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
