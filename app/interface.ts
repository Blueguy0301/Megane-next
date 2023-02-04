import type { ReactNode, MouseEventHandler, Dispatch, SetStateAction } from "react"

export interface login {
	username: string
	password: string
}
export type formData = {
	name: string
	Category: string
	price: number | string
	location: string
	mass: string
	description: string
}
export type addProps = {
	Modal: (props: {
		title: string
		children: ReactNode
		onAccept?: MouseEventHandler
		confirmText?: string | number
		[x: string]: any
	}) => JSX.Element
	Scanned: string
	setScanned: Dispatch<SetStateAction<string>>
}
