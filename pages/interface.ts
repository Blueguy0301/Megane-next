export type product = {
	name: string
	barcode: string | number
	category: string
	mass: number | string
}
export interface productStore extends product {
	productId?: bigint | string
	storeId: bigint
	price: number
	location: string
	description: string
}
export type user = {
	userName: string
	password: string
	storeId: string | bigint
}
export interface userData extends user {
	authorityId: number
	error?: string
}

export type Invoice = {
	storeId: string | bigint
	installmentId?: bigint | string
	dateTime: Date
	purchases: bigint[]
}
