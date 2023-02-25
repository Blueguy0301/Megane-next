import { addCheckout } from "@responses"
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
export type modal = (props: {
	title: string
	children: ReactNode
	onAccept?: MouseEventHandler
	confirmText?: string | number
	buttonSettings?: object
	[x: string]: any
}) => JSX.Element
export type addProps = {
	Modal: modal
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
export type checkoutProducts = {
	name: string
	price: number
	productStoreId: string
	mass: string
	quantity: number
}