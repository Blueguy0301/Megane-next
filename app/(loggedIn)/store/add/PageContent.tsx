/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { minCodeLength } from "@pages/types"
import type { formData } from "@app/types"
import type { addStoreProduct, productScanner } from "@responses"
import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

import useModal from "@components/useModal"
import Button from "@components/Button"
import { failed, success } from "@components/crudModals"
import { scannerRequest, newProduct as sendData } from "@components/request"

import ModalScanner from "./components/Modal"
import ProductForm from "./components/ProductForm"
import FormData from "./components/FormData"

type responseData = { status: number; data: addStoreProduct }
type responseType = { data: productScanner }
export default function page() {
	const { register, handleSubmit, formState, watch, setValue, reset } =
		useForm<formData>()
	const { errors, isSubmitting, isDirty } = formState
	const scanController = new AbortController()
	const [isStoreNew, setIsStoreNew] = useState(true)
	const [showSubmit, setShowSubmit] = useState(false)
	const [scanPressed, setScanPressed] = useState(false)
	const [formDisabled, setFormDisabled] = useState([false, false])
	const asyncData = async (data: formData) => {
		const { status, data: res }: responseData = await sendData(data, isStoreNew, Scanned)
		const { error } = res
		if (status === 200 && !error) {
			success("Product added Successfully.")
			//*reset the forms
			// nav.push("/store/inventory")
			setScanned("none")
			reset()
			setFormDisabled([false, false])
			setShowSubmit(true)
		} else if (error) {
			failed(error)
			setFormDisabled([false, false])
			setShowSubmit(true)
		}
	}
	const searchBarcode = async () => {
		const response = (await scannerRequest(Scanned, scanController, {
			barcode: Scanned,
			productScan: true,
		})) as responseType

		if ("e" in response) return
		if (response.data.error) return failed(response.data.error)
		const { result } = response.data as productScanner
		if (!result) return failed("No product found")
		if (!result.isStoreNew)
			return failed(`${result?.name} is already registered to this store.`)
		if (!response.data.result?.newProduct) {
			setIsStoreNew(result?.isStoreNew ?? false)
			setFormDisabled([!result?.newProduct, false])
			setValue("name", result?.name)
			setValue("Category", result?.Category)
			setValue("mass", result?.mass)
		}

		return
	}
	const onSubmit: SubmitHandler<formData> = (data) => {
		//* submit to api here.
		setShowSubmit(false)
		setFormDisabled([true, true])
		asyncData(data)
	}
	const formData = watch()
	const [Scanned, setScanned] = useState("none")
	const { Modal, Open, setIsOpen } = useModal()
	useEffect(() => {
		setShowSubmit(true)
	}, [])
	useEffect(() => {
		//* add request here everytime that the scanned value is changed
		if (Scanned.length >= minCodeLength) searchBarcode()
		return () => scanController.abort()
	}, [Scanned])
	return (
		<div className="page box-border flex-wrap">
			<ModalScanner
				Modal={Modal}
				Scanned={Scanned}
				setScanned={setScanned}
				errors={errors}
				scanPressed={scanPressed}
				setScanPressed={setScanPressed}
				setIsOpen={setIsOpen}
			/>
			<form
				className="box-border flex  min-w-[50%] flex-grow flex-col gap-3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<ProductForm
					register={register}
					setScanned={setScanned}
					setValue={setValue}
					Scanned={Scanned}
					Open={Open}
					disabled={formDisabled[0]}
					setScanPressed={setScanPressed}
				/>
				<fieldset
					className="min-w-1/2 flex flex-col p-4 disabled:opacity-50"
					disabled={formDisabled[1]}
				>
					<div className="relative flex flex-col gap-4 border border-solid border-white p-4">
						<h3 className="float">Sales information</h3>
						<div className="group">
							<label htmlFor="price">Price</label>
							<input
								type="number"
								id="price"
								min={0}
								{...register("price", { required: "Price is required" })}
							/>
						</div>
						<div className="group">
							<label htmlFor="location">Loaction</label>
							<input
								type="text"
								id="location"
								{...register("location", { required: "Location is required" })}
							/>
						</div>
						<div className="group">
							<label htmlFor="desc">Description</label>
							<input
								type="text"
								id="desc"
								{...register("description", { required: "Description is required" })}
							/>
						</div>
					</div>
				</fieldset>
				{showSubmit && (
					<div className="mt-auto flex flex-wrap items-center justify-center gap-4 p-4">
						<Button
							className="flex-grow disabled:opacity-50"
							type="submit"
							onClick={(e) => {
								if (Object.keys(errors).length > 0) {
									setScanPressed(false)
									setIsOpen(true)
								}
							}}
							disabled={!isDirty || isSubmitting}
						>
							Add product
						</Button>
						<Button
							type="reset"
							className="red flex-grow"
							onClick={() => {
								setScanned("none")
								setFormDisabled([false, false])
								reset
							}}
							id="reset"
						>
							Reset
						</Button>
					</div>
				)}
			</form>
			<FormData Scanned={Scanned} formData={formData} />
		</div>
	)
}
