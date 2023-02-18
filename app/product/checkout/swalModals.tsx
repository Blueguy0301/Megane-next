import React from "react"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
const modal = withReactContent(Swal)
type result = {
	success: boolean
	customerName: string | null
	total: number
	installmentTotal: number | null
}
export const errorModal = (error: string | object) => {
	return modal.fire({
		title: "Error",
		icon: "error",
		showConfirmButton: false,
		text: error as string,
		timer: 1500,
		timerProgressBar: true,
	})
}
export const successModal = (result: result, change: number) => {
	return modal.fire({
		title: "Success!",
		icon: "success",
		text: `Checkout success! \n Total :${result.total} \n Change : ${change} `,
	})
}
