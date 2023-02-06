import axios from "axios"
import { formData, sendData as dataSend } from "../../../interface"
export const sendData = (
	data: formData,
	isStoreNew: boolean,
	barcode: string,
	pid = ""
) => {
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
	const fetcher = (url: string) => {
		return axios.post(url, dataSending, { params }).then((d) => console.log(d))
	}
	const key = "/api/store/product"
	return fetcher(key)
}
export const checkBarcode = async (scanned: string) => {
	//todo : add a cache to localstorage
	const url = "/api/store/scanner"
	const { data, status } = await axios.get(url, {
		params: { barcode: scanned, productScan: true },
	})
	return data
}
