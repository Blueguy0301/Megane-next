import { modal } from "@app/types"
import { failed, success } from "@components/crudModals"
import { useState, useEffect } from "react"
import { add, update } from "./request"
type props = {
	modal: modal
	modalOpened: string
	isOpen: boolean
	selected: string
	isAdded?: boolean
}
type forms = { customerName: string; total: number; isAdded: boolean }
const ModalForms = (props: props) => {
	const Modal = props.modal
	const { modalOpened } = props
	const [forms, setForms] = useState<forms>({ customerName: "", total: 0, isAdded: true })
	const handleChange = (name: string, value: string | number | boolean) => {
		console.log(name, value)
		setForms((prev) => ({ ...prev, [name]: value }))
	}
	useEffect(() => setForms({ customerName: "", total: 0, isAdded: true }), [props.isOpen])
	if (modalOpened === "add") {
		const submitHandler = async () => {
			const res = await add({ ...forms, isAdded: true })
			console.log("e" in res)
			if ("e" in res) return
			if (res.data.error) return failed(res.data.error)
			if (res.data.result) {
				//todo :  Refresh or add it to the table
				return success("Added Successfully")
			} else return failed("Putangina.")
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
								value={forms.customerName}
								onChange={(e) => handleChange("customerName", e.target.value)}
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
								value={forms.total}
								onChange={(e) => handleChange("total", e.target.valueAsNumber)}
							/>
						</div>
					</div>
				</form>
			</Modal>
		)
	}

	if (modalOpened === "update") {
		const submitHandler = async () => {
			const res = await update({ ...forms, id: props.selected })

			if ("e" in res) return
			if (res.data.error) return failed(res.data.error)
			if (res.data.result) {
				//todo :  Refresh or add it to the table
				return success("Updated Successfully.")
			} else return failed("An error occured.")
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
						<div className="flex flex-grow items-center gap-2">
							<p>PHP</p>
							<input
								type="number"
								className="w-full"
								placeholder={(0).toFixed(2)}
								name="total"
								value={forms.total}
								onChange={(e) => handleChange("total", e.target.valueAsNumber)}
							/>
						</div>
					</div>
					<div className="checkout group relative flex-grow ">
						<label htmlFor="deduct">Add:</label>
						<div className="flex-grow">
							<input
								type="checkbox"
								name="yes"
								id="deduct"
								onChange={(e) => handleChange("isAdded", e.target.checked)}
								checked={forms.isAdded}
							/>
						</div>
					</div>
				</div>
			</Modal>
		)
	} else return <></>
}

export default ModalForms
