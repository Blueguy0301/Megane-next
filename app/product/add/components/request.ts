import axios from "axios"
import { formData, sendData as dataSend } from "../../../interface"
export const sendData = (
	data: formData,
	isStoreNew: boolean,
	barcode: string,
	pid = ""
) => {
	const key = "/api/store/product"

	let params: object = isStoreNew ? { isStoreNew: true } : {}
	let dataSending: dataSend
	if (pid !== "") {
		params = { ...params, pId: pid }
		dataSending = {
			price: data.price,
			location: data.location,
			description: data.description,
		}
	} else {
		dataSending = {
			barcode: barcode,
			name: data.name,
			category: data.Category,
			mass: data.mass,
			price: data.price,
			location: data.location,
			description: data.description,
		}
	}
	return axios.post(key, dataSending, { params })
}
export const checkBarcode = async (scanned: string, controller: AbortController) => {
	//todo : add a cache to localstorage
	const url = "/api/store/scanner"
	if (scanned === "none") return
	const result = await axios
		.get(url, {
			params: { barcode: scanned, productScan: true },
			signal: controller.signal,
		})
		.catch((e) => ({ result: e }))
	return result as any
}
