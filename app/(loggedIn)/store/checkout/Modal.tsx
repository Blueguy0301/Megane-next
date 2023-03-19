"use client"
import type { ChangeEvent, Dispatch, SetStateAction, MutableRefObject } from "react"
import type { checkoutProducts, modal } from "@app/types"
import type { addCheckout, storeProductScanner } from "@responses"
import { useState, useEffect, useCallback } from "react"
import { checkOut, scannerRequest } from "@components/request"
import { minCodeLength } from "@pages/types"
import { success, failed } from "@components/crudModals"
import { useForm } from "react-hook-form"
type formData = {
	name?: string
	amount?: number
	barcode: string
}
type charges = {
	key: string
	value: number
}
type Props = {
	Modal: modal
	Total: number
	modalOpened?: string
	barcode: [barcode: string, setBarcode: Dispatch<SetStateAction<string>>]
	charges: [charge: charges[], setCharge: Dispatch<SetStateAction<charges[]>>]
	products: [checkoutProducts[], Dispatch<SetStateAction<checkoutProducts[]>>]
	quantity: number
	audio: MutableRefObject<HTMLAudioElement | undefined>
	open: [boolean, Dispatch<SetStateAction<boolean>>]
}
const Modal = (props: Props) => {
	const { Modal, Total, modalOpened, quantity, audio } = props
	const [barcode, setBarcode] = props.barcode
	const [charges, setCharges] = props.charges
	const [products, setProducts] = props.products
	const [isOpen, setIsOpen] = props.open
	const [selected, setSelected] = useState("Cash")
	const [formData, setFormData] = useState<formData>({
		name: "",
		amount: 0,
		barcode: barcode,
	})
	const handleCheckout = async () => {
		const res = await checkOut(products, Total, formData, selected !== "Cash")
		if ("e" in res) return
		const { result, error: serverError } = res.data as addCheckout
		if (serverError) return failed(serverError)
		else if (result) {
			const change = (formData.amount ?? 0) - Total
			setProducts([])
			return success(`Checkout success! \n Total :${result.total} \n Change : ${change}`)
		}
		return
	}
	const { register, handleSubmit, reset, formState: errors } = useForm<charges>()
	useEffect(() => {
		reset()
	}, [isOpen])
	const [error, setError] = useState<{ error: any }>({ error: "" })
	const scannerController = new AbortController()
	const fetchData = async () => {
		const response = await scannerRequest(formData.barcode, scannerController)
		if ("e" in response) return
		const { data } = response
		if ("error" in data) return setError({ error: error })
		const { result, error: serverError } = response.data as storeProductScanner
		if (serverError) return setError({ error: serverError })
		if (!result || Object.keys(result).length === 0)
			return setError({ error: "No product found" })
		const { name, mass, price, productStoreId } = result
		audio.current?.play()
		setProducts((prev) => {
			const existingProductIndex = prev.findIndex(
				(v) => v.productStoreId === productStoreId
			)
			if (existingProductIndex >= 0) {
				return prev.map((v, i) => {
					if (i === existingProductIndex) {
						return { ...v, quantity: v.quantity + quantity }
					}
					return v
				})
			}
			return [...prev, { name, price, productStoreId, mass, quantity }]
		})
		setBarcode("")
		setIsOpen(false)
	}
	useEffect(() => {
		console.log("dan")
		setError({ error: "" })
		if (formData.barcode.length >= minCodeLength) fetchData()
		return () => {
			scannerController.abort()
		}
	}, [formData.barcode])

	const handleFormData = useCallback((name: string, charge = false) => {
		console.log("ran")
		return async (e: ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target
			setFormData((prev) => {
				if (name === "name") {
					return { ...prev, name: value }
				}
				if (name === "amount") {
					const number: number = e.target.valueAsNumber
					return { ...prev, amount: number }
				}
				if (name === "barcode") {
					return { ...prev, barcode: value }
				}
				return prev
			})
			// setCharges((prev) => {})
		}
	}, [])
	if (modalOpened === "Manual Add") {
		return (
			<Modal
				title="Manual Add"
				className="relative flex flex-wrap"
				confirmText="Add"
				hideConfirm
			>
				<fieldset className="flex flex-grow  flex-wrap gap-4">
					<div className="checkout group flex-grow">
						<label htmlFor="code">Barcode</label>
						<div className="flex flex-grow items-center justify-center gap-4">
							<input
								type="text"
								id="CustomerName"
								name="name"
								onChange={handleFormData("barcode")}
							/>
						</div>
						<p className=" w-full text-center font-semibold text-red-500">
							{error.error}
						</p>
					</div>
				</fieldset>
			</Modal>
		)
	}
	if (modalOpened === "checkOut") {
		return (
			<Modal
				title="Checkout Information"
				className="relative flex flex-wrap "
				confirmText="Checkout"
				onAccept={() => handleCheckout()}
			>
				<div className="relative flex flex-col flex-wrap gap-4 lg:w-3/4">
					<fieldset className="flex flex-grow  flex-wrap gap-4">
						<div className="checkout group ">
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
						<h3 className="float checkout">Summary</h3>
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
	}
	if (modalOpened === "Add Charge") {
		return (
			<Modal
				title="Extra Charge"
				className="relative flex flex-wrap"
				confirmText="Confirm"
				onAccept={handleSubmit(
					({ key, value }) => {
						console.log(key, value)
						setCharges((prev) => [...prev, { key, value }])
						return setIsOpen(false)
					},
					() => failed("Description and amount is required")
				)}
				buttonSettings={{ type: "submit", disablehandle: "true" }}
			>
				<form
					className="relative flex flex-col-reverse flex-wrap gap-4 lg:w-3/4"
					onSubmit={handleSubmit((v) => console.log(v))}
				>
					{charges.map((charge, i) => {
						return (
							<fieldset className="customer" disabled={true} key={`disabled ${i}`}>
								<div className="checkout group">
									<input
										type="text"
										placeholder="Description"
										value={charge.key}
										readOnly
									/>
									<input
										type="number"
										value={charge.value}
										placeholder="Amount"
										readOnly
									/>
								</div>
							</fieldset>
						)
					})}
					<fieldset className="customer">
						<div className="checkout group">
							<input
								type="text"
								placeholder="Description"
								{...register("key", { required: true })}
							/>
							<input
								type="number"
								{...register("value", { required: true })}
								placeholder="Amount"
							/>
						</div>
					</fieldset>
				</form>
			</Modal>
		)
	} else return <></>
}

export default Modal
