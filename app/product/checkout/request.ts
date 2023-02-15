import { checkOutBody, InvoicePurchase, minCodeLength } from "@pages/types"
import { storeProductScanner } from "@responses"
import axios, { AxiosError, AxiosResponse } from "axios"
type checkOut = InvoicePurchase | InvoicePurchase[]
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
	console.log(product)
	return product
}

export const checkOut = async (
	products: checkOut,
	total: number,
	customerName?: string,
	isCredited = false
) => {
	const url = "/api/store/checkout"
	const body: checkOutBody = {
		productList: products,
		total,
		customerName,
		isCredited,
	}
	const result = await axios.post(url, body).catch((e) => e)
	console.log(result)
	return result
}
