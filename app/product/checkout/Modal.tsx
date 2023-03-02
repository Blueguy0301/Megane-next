"use client"
import type { ChangeEvent, Dispatch, SetStateAction, MutableRefObject } from "react"
import type { checkoutProducts, modal } from "@app/types"
import type { addCheckout, storeProductScanner } from "../../../response.type"
import { useState, useEffect } from "react"
import { checkOut, scannerRequest } from "@components/request"
import { errorModal, successModal } from "./swalModals"
import { minCodeLength } from "@pages/types"
type formData = {
	name?: string
	amount?: number
	barcode: string
}
type Props = {
	Modal: modal
	Total: number
	modalOpened?: string
	barcode: string
	setBarcode: Dispatch<SetStateAction<string>>
	products: [checkoutProducts[], Dispatch<SetStateAction<checkoutProducts[]>>]
	quantity: number
	audio: MutableRefObject<HTMLAudioElement | undefined>
	setIsOpen: Dispatch<SetStateAction<boolean>>
}
const Modal = (props: Props) => {
	const { Modal, Total, modalOpened, barcode, quantity, audio } = props
	const [products, setProducts] = props.products
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
		if (serverError) return errorModal(serverError)
		else if (result) {
			setProducts([])
			return successModal(result, (formData.amount ?? 0) - Total)
		}
		return
	}
	const [error, setError] = useState<{ error: any }>({ error: "" })
	const scannerController = new AbortController()
	const fetchData = async () => {
		const response = await scannerRequest(formData.barcode, scannerController)
		console.log("response", response)
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
		props.setBarcode("")
		props.setIsOpen(false)
	}
	useEffect(() => {
		console.log("dan")
		setError({ error: "" })
		if (formData.barcode.length >= minCodeLength) fetchData()
		return () => {
			scannerController.abort()
		}
	}, [formData.barcode])
	const handleFormData = (name: string) => {
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
		}
	}
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
	} else return <></>
}

export default Modal
