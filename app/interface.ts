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
	errors: any
	scanPressed: boolean
	setScanPressed: any
	setIsOpen?: Dispatch<SetStateAction<boolean>>
}
export type sendData = {
	price: string | number
	location: string
	description: string
	barcode?: string
	name?: string
	category?: string
	mass?: string
}
