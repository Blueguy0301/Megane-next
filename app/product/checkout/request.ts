import type { InvoicePurchase } from "@pages/types"
import axios from "axios"
type checkOut = InvoicePurchase | InvoicePurchase[]
export const scannerRequest = async (code: string, controller: AbortController) => {
	if (!(code.length >= 12)) return { data: {}, error: {} }
	const url = "/api/store/scanner"
	const product = await axios
		.get(url, {
			params: { barcode: code, storeScan: true },
			signal: controller.signal,
		})
		.catch((e) => e)
	return product
}

export const checkOut = async (products: checkOut, controller: AbortController) => {
	const url = "/api/store/checkout"
	const result = await axios.post(url, {})
}
