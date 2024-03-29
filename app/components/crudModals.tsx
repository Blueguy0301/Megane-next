import swalModal from "@components/swalModal"

export const warning = (text?: string) =>
	swalModal.fire({
		title: "Are you sure?",
		text: text,
		showCancelButton: true,
		cancelButtonText: "No",
		confirmButtonText: "Yes",
		customClass: {
			cancelButton: "red",
			confirmButton: "green",
			popup: "swal-popup",
		},
		timer: 5000,
		icon: "warning",
	})
export const success = (title?: string) =>
	swalModal.fire({
		title: title ?? "Succesfully Added",
		icon: "success",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		customClass: {
			cancelButton: "red",
			confirmButton: "green",
			popup: "swal-popup",
		},
	})
export const failed = (message: string | object) =>
	typeof message === "object"
		? swalModal.fire({
				title: "An error has occured",
				icon: "error",
				text: JSON.stringify(message),
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				customClass: {
					cancelButton: "red",
					confirmButton: "green",
					popup: "swal-popup",
				},
		  })
		: swalModal.fire({
				title: "An error has occured",
				icon: "error",
				text: message,
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				customClass: {
					cancelButton: "red",
					confirmButton: "green",
					popup: "swal-popup",
				},
		  })
