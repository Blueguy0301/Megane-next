import { modal } from "@app/types"
import { useState, useEffect } from "react"
type props = {
	modal: modal
	modalOpened: string
	isOpen: boolean
}
type forms = { name: string; amount: number }
const ModalForms = (props: props) => {
	const Modal = props.modal
	const { modalOpened } = props
	const [forms, setForms] = useState<forms>({ name: "", amount: 0 })
	const handleChange = (name: string, value: string | number) => {
		setForms((prev) => ({ ...prev, [name]: value }))
	}
	useEffect(() => setForms({ name: "", amount: 0 }), [props.isOpen])
	if (modalOpened === "add") {
		const submitHandler = () => {
			console.log(forms)
		}
		return (
			<Modal
				title="New Installment"
				className="relative flex flex-wrap gap-4"
				confirmText="Add"
				onAccept={submitHandler}
			>
				<form className="flex flex-col flex-wrap gap-4">
					<div className="customer">
						<div className="checkout group">
							<label htmlFor="CustomerName">Customer's Name:</label>
							<input
								type="text"
								id="CustomerName"
								name="name"
								value={forms.name}
								onChange={(e) => handleChange("name", e.target.value)}
							/>
						</div>
					</div>
					<div className="checkout group relative flex-grow">
						<label htmlFor="amount">Amount:</label>
						<div className="relative flex flex-grow items-center gap-2">
							<p>PHP</p>
							<input
								id="amount"
								type="number"
								className="w-full"
								placeholder={(0).toFixed(2)}
								name="amount"
								value={forms.amount}
								onChange={(e) => handleChange("amount", e.target.valueAsNumber)}
							/>
						</div>
					</div>
				</form>
			</Modal>
		)
	}

	if (modalOpened === "update") {
		const submitHandler = () => {
			console.log(forms)
		}
		return (
			<Modal
				title="Update"
				className="relative flex flex-wrap gap-4"
				confirmText="Update"
				onAccept={submitHandler}
			>
				<div className="flex flex-col flex-wrap gap-4">
					<div className="checkout group relative flex-grow">
						<label htmlFor="">New Amount:</label>
						<div className="relative flex flex-grow items-center gap-2">
							<p>PHP</p>
							<input
								type="number"
								className="w-full"
								placeholder={(0).toFixed(2)}
								name="amount"
								value={forms.amount}
								onChange={(e) => handleChange("amount", e.target.valueAsNumber)}
							/>
						</div>
					</div>
				</div>
			</Modal>
		)
	} else return <></>
}

export default ModalForms
