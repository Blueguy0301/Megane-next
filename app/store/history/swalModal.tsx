import swalModal from "@components/swalModal"
export const deleteSuccess = (count?: number | string) => {
	return swalModal.fire({
		title: "Succesfully Deleted",
		icon: "success",
		text: `${count ?? 0} record deleted`,
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	})
}
export const deleteFailed = () => {
	return swalModal.fire({
		title: "An error has occured",
		icon: "error",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	})
}
export const addSuccess = () => {
	return swalModal.fire({
		title: "Succesfully Added",
		icon: "success",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	})
}

export const deletePrompt = (text: string) => {
	return swalModal.fire({
		title: "Are you sure?",
		text,
		icon: "warning",
		showCancelButton: true,
		customClass: {
			cancelButton: "red",
			confirmButton: "green",
			popup: "swal-popup",
		},
	})
}
