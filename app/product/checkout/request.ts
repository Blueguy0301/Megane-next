import axios from "axios"

export const scannerRequest = async (code: string, controller: AbortController) => {
	if (!(code.length >= 12)) return { data: {}, error: {} }
	const url = "/api/store/scanner"
	const product = await axios
		.get(url, {
			params: { barcode: code, storeScan: true },
			signal: controller.signal,
		})
		.catch((e) => ({
			error: e,
		}))
	return product
}
