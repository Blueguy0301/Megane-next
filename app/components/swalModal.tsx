import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import React from "react"

const swalModal = withReactContent(Swal)
//todo : insert custom classes here.
const customClass = {
	cancelButton: "red",
	confirmButton: "green",
	popup: "swal-popup",
}
export default swalModal
