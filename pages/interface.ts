import { productScanner } from "@responses"
import type { NextApiRequest, NextApiResponse } from "next"

export type product = {
	name: string
	barcode: string
	category: string
	mass: string
}
export interface productStore extends product {
	productId?: bigint | string
	storeId?: bigint
	price: number
	location: string
	description?: string
}
export type user = {
	userName: string
	password: string
	storeId: string
}
export interface userData extends user {
	authorityId: number
	error?: string
}
export interface payload {
	data: userDetails
	cty: string
	iat: bigint
	exp: bigint
	error?: string
}
export interface userDetails {
	id: string
	authorityId: number
	storeId: number
	userName: string
	password?: string
}
export type Invoice = {
	storeId: bigint
	installmentId?: bigint
	dateTime: Date
	total: number
}
export type InvoicePurchase = {
	productStoreId: bigint | string
	quantity: number
}

export interface userData extends user {
	authorityId: number
	error?: string
}

export type error = {
	error: string
}
export type productQuery = {
	isNew?: boolean
	isStoreNew?: boolean
	storeSearch?: boolean
	onlyStore?: boolean
	pId?: number | string
}
export type nextFunction = (
	req: NextApiRequest,
	res: NextApiResponse,
	credentials: userDetails,
	...others: any[]
) => any

export enum authority {
	guest = 1,
	registered = 2,
	storeOwner = 3,
	admin = 4,
}
export interface installments {
	id: string
	customerName: string
	total: number
	isAdded: boolean
}
export const minCodeLength = 8

export type checkOutBody = {
	productList: InvoicePurchase[] | InvoicePurchase
	total: number
	isCredited?: boolean
	customerName?: string
	creditTotal: number
}
