
import { checkOutBody, InvoicePurchase, minCodeLength } from "@pages/types"
import { storeProductScanner } from "../../../response.type"
import axios, { AxiosError, AxiosResponse } from "axios"
type checkOut = InvoicePurchase | InvoicePurchase[]
type formData = {
	name?: string
	amount?: number
	barcode?: string

}
export const scannerRequest = async (code: string, controller: AbortController) => {
	if (!(code.length >= minCodeLength))
		return {
			data: { result: {} },
			error: {},
		} as { data: storeProductScanner; error: any }
	const url = "/api/store/scanner"
	const product = await axios
		.get<{ data?: storeProductScanner }>(url, {
			params: { barcode: code, storeScan: true },
			signal: controller.signal,
		})
		.catch((e) => ({ e: e }))
	return product
}

export const checkOut = async (
	products: checkOut,
	total: number,
	formData: formData,
	isCredited = false
) => {
	const url = "/api/store/checkout"
	const body: checkOutBody = {
		productList: products,
		total,
		customerName: formData.name,
		isCredited,
		creditTotal: isCredited ? total - (formData.amount ?? 0) : 0
	}
	const result = await axios.post(url, body).catch((e) => ({ e: e }))
	return result
}
