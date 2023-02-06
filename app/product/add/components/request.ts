import axios from "axios"
import { formData } from "../../../interface"
export const sendData = (data: formData, isStoreNew: boolean, barcode: string) => {
	let params = isStoreNew ? { isStoreNew: true } : {}
	const fetcher = (url: string) => {
		return axios
			.post(
				url,
				{
					barcode: barcode,
					name: data.name,
					category: data.Category,
					mass: data.mass,
					price: data.price,
					location: data.location,
					description: data.description,
				},
				{
					params,
				}
			)
			.then((d) => console.log(d))
	}
	const key = "/api/store/product"
	return fetcher(key)
}
