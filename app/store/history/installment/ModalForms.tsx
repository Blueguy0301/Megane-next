import { modal } from "@app/types"
import React from "react"
type props = {
	modal: modal
	modalOpened: string
}
const ModalForms = (props: props) => {
	const Modal = props.modal
	const modalOpened = props.modalOpened
	if (modalOpened === "add")
		return (
			<Modal
				title="New Installment"
				className="relative flex flex-wrap gap-4"
				confirmText="Add"
			>
				<div className="flex flex-col flex-wrap gap-4">
					<div className="customer">
						<div className="checkout group">
							<label htmlFor="CustomerName">Customer's Name:</label>
							<input type="text" id="CustomerName" name="name" />
						</div>
					</div>
					<div className="checkout group relative flex-grow">
						<label htmlFor="">Amount:</label>
						<div className="relative flex flex-grow items-center gap-2">
							<p>PHP</p>
							<input type="number" className="w-full" placeholder={(0).toFixed(2)} />
						</div>
					</div>
				</div>
			</Modal>
		)
	if (modalOpened === "update")
		return (
			<Modal
				title="Update"
				className="relative flex flex-wrap gap-4"
				confirmText="Update"
			>
				<div className="flex flex-col flex-wrap gap-4">
					<div className="checkout group relative flex-grow">
						<label htmlFor="">New Amount:</label>
						<div className="relative flex flex-grow items-center gap-2">
							<p>PHP</p>
							<input type="number" className="w-full" placeholder={(0).toFixed(2)} />
						</div>
					</div>
				</div>
			</Modal>
		)
	else return <></>
}

export default ModalForms
