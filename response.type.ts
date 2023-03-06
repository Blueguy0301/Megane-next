export interface getStoreProduct {
	error?: string
	result?: {
		name: string
		barcode: string
		price: number
		location: string
		description: string
		productStoreId: string
		productId: string
	}
}
export interface deleteStoreProduct {
	error?: string | object
	success: boolean
}
export interface updateStoreProduct {
	error?: string
	result?: {
		id: string
		storeId: string
		productId: string
		price: number
		Location: string
		Description: string
	}
}
export interface addStoreProduct {
	error?: string | object
	result?: {
		id: string
		price: number
		Location: string
		Description: string
		productId: string
		storeId: string
	}
}
export interface addProduct {
	error?: string | object
	result?: {
		name: string
		barcode: string
		Category: string
		mass: string
		id: string
	}
}
export interface updateProduct {
	error?: string | object
	result?: {
		price: number
		Location: string,
		Description: string,
		productStoreId: string,
		productId: string,
	}
}
export interface deleteProduct {
	error?: string | object
	success: boolean
}
export interface storeProductScanner {
	error?: string | object
	result?: {
		name: string
		mass: string
		price: number
		productStoreId: string
	}
}
export interface productScanner {
	error?: string | object
	result?: {
		newProduct: boolean
		isStoreNew: boolean
		name: string
		barcode: string
		Category: string
		mass: string
		productId: string
	}
}
export interface getInstallment {
	error?: string | object
	result: {
		id: string
		total?: number
		customerName?: string
	}
}
export interface updateInstallment {
	error?: string | object
	result?: {
		id: string
		customerName: string
		total: number
	}
}
export interface deleteInstallment {
	error?: string | object
	success: boolean
}
export interface addInstallment {
	error?: string | object
	result?: {
		id: string
		customerName: string
		total: number
	}
}
export interface addCheckout {
	error?: string | object
	result?: {
		success: boolean
		customerName: string | null
		total: number
		installmentTotal: number | null
	}
}
export interface updateCheckout {
	error?: string | object
}
export interface deleteCheckout {
	error?: string | object
	success: boolean
	count?: number | string
}
export interface getCheckOut {
	error?: string | object
	result?: {
		id: string
		products: {
			name: string
			mass: string
			price: number
		}[]
		Installment: string | boolean
		date: Date
	}
}
export interface createStore {
	error?: string | object
	result?: {
		id: string;
		name: string;
	}
}
export type deleteStore = {
	success: boolean,
	error?: string | object
}
export type createUser = {
	success: boolean,
	error?: string | object

}

