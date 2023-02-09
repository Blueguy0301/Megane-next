"use client"
import { MouseEventHandler, ReactNode, useState } from "react"
import type { ChangeEvent } from "react"
import { modal } from "../../interface"
import { useForm } from "react-hook-form"
type formData = {
	name?: string
	amount: number | undefined
}
type Props = {
	Modal: modal
	Total: number
	modalOpened?: string
	barcode: string
	setBarcode: any
}
//todo : add multiple modal here : the following are important :
//* Manual add
const Modal = (props: Props) => {
	const { Modal, Total, modalOpened, barcode, setBarcode } = props
	const [selected, setSelected] = useState("Cash")
	const [formData, setFormData] = useState<formData>({
		name: "",
		amount: 0,
	})
	const { register } = useForm()

	const handleFormData = (name: string) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target
			setFormData((prev) => {
				if (name === "name") {
					return { ...prev, name: value }
				}
				if (name === "amount") {
					const number: number = e.target.valueAsNumber
					return { ...prev, amount: number }
				}
				return prev
			})
		}
	}
	if (modalOpened === "Manual Add") {
		// setIsOpen && setIsOpen(true)
		return (
			<Modal title="Manual Add" className="relative flex flex-wrap" confirmText="Add">
				<fieldset className="flex flex-grow  flex-wrap gap-4">
					<div className="checkout group">
						<label htmlFor="code">Barcode</label>
						<div className="flex flex-grow items-center justify-center gap-4">
							<input
								type="text"
								name="code"
								id="code"
								value={barcode}
								onChange={(e) => setBarcode(e.target.value)}
								autoFocus
							/>
						</div>
					</div>
				</fieldset>
			</Modal>
		)
	}
	if (modalOpened === "checkOut") {
		// setIsOpen && setIsOpen(true)
		return (
			<Modal
				title="Checkout Information"
				className="relative flex flex-wrap "
				confirmText="Checkout"
			>
				<div className="relative flex flex-col flex-wrap gap-4 lg:w-3/4">
					<fieldset className="flex flex-grow  flex-wrap gap-4">
						<div className="checkout group">
							<label className=" ">Payment Option</label>
							<div className="flex flex-grow items-center justify-center gap-4">
								<input
									type="radio"
									name="PaymentOption"
									id="Cash"
									value="Cash"
									onChange={() => setSelected("Cash")}
									checked={selected === "Cash"}
								/>
								<label htmlFor="Cash">Cash</label>
								<input
									type="radio"
									name="PaymentOption"
									id="Installment"
									value="Installment"
									onChange={() => setSelected("Installment")}
									checked={selected === "Installment"}
								/>
								<label htmlFor="Installment">Installment</label>
							</div>
						</div>
					</fieldset>
					<fieldset disabled={selected === "Cash"} className="customer">
						<div className="checkout group">
							<label htmlFor="CustomerName">Customer Name</label>
							<input
								type="text"
								id="CustomerName"
								name="name"
								onChange={handleFormData("name")}
								defaultValue={formData.name}
							/>
						</div>
					</fieldset>

					<div className="checkout group relative flex-grow">
						<label htmlFor="">Amount Paid:</label>
						<div className="relative flex flex-grow items-center gap-2">
							<p>PHP</p>
							<input
								type="number"
								className="w-full"
								placeholder={(0).toFixed(2)}
								onChange={handleFormData("amount")}
								value={formData.amount}
							/>
							<button
								type="button"
								className="scan-btn"
								onClick={() =>
									setFormData((prev) => {
										return { ...prev, amount: Total }
									})
								}
							>
								Exact
							</button>
						</div>
					</div>
					<div className="relative mt-10 box-border flex flex-grow border border-solid border-white">
						<h3 className="float checkout">Sumarry</h3>
						<div className="z-10 flex w-full flex-col items-center justify-evenly  p-3">
							<span className="checkout info flex flex-row gap-3">
								<h4 className="">Payment Option</h4>
								<h5>{selected}</h5>
							</span>
							{selected === "Installment" && (
								<span className="info checkout flex flex-row gap-3">
									<h4>Customer Name</h4>
									<h5>{(formData.name === "" && "Enter Customer") || formData.name}</h5>
								</span>
							)}
							<span className="info checkout flex flex-row gap-3">
								<h4>Amount Paid</h4>
								<h5>PHP {Number.isNaN(formData.amount) ? "0.00" : formData.amount}</h5>
							</span>
						</div>
					</div>
				</div>
			</Modal>
		)
	} else return <></>
}

export default Modal
