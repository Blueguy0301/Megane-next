/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, useEffect } from "react"
import Button from "@components/Button"
import useModal from "@components/useModal"
import { formData } from "../../interface"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import ModalScanner from "./components/Modal"
import ProductForm from "./components/ProductForm"
import FormData from "./components/FormData"
import { checkBarcode, sendData } from "./components/request"
import { useRouter } from "next/navigation"
import swalModal from "@components/swalModal"
import { minCodeLength } from "../../../pages/interface"
export default function page() {
	const { register, handleSubmit, formState, watch, setValue, reset } =
		useForm<formData>()
	const { errors, isSubmitting, isDirty } = formState
	const scanController = new AbortController()
	const nav = useRouter()
	const [isStoreNew, setIsStoreNew] = useState(true)
	const [showSubmit, setShowSubmit] = useState(false)
	const [scanPressed, setScanPressed] = useState(false)
	const [formDisabled, setFormDisabled] = useState([false, false])
	const onSubmit: SubmitHandler<formData> = (data) => {
		//* submit to api here.
		setShowSubmit(false)
		setFormDisabled([true, true])
		const asyncData = async () => {
			const {
				status,
				data: { result },
			} = await sendData(data, isStoreNew, Scanned)
			if (status === 200 && (!result.error || !result.clientVersion)) {
				swalModal.fire({
					title: "Success",
					showConfirmButton: false,
					icon: "success",
					text: "Redirecting to Inventory",
					timer: 3000,
					timerProgressBar: true,
				})
				nav.push("/store/inventory")
			} else if (result.error) {
				swalModal.fire({
					title: "Error",
					showConfirmButton: false,
					text: result.error,
					timer: 3000,
					icon: "error",
				})
				setFormDisabled([false, false])
				setShowSubmit(true)
			}
		}
		asyncData()
	}
	const formData = watch()
	const [Scanned, setScanned] = useState("none")
	//todo : make this into one whole component where you can use just one modal
	const { Modal, Open, setIsOpen } = useModal()
	useEffect(() => {
		setShowSubmit(true)
	}, [])
	useEffect(() => {
		//* add request here everytime that the scanned value is changed
		const asyncData = async () => {
			const { result, data } = await checkBarcode(Scanned, scanController)
			if (!result) {
				setIsStoreNew(data.result.isStoreNew ?? false)
				setFormDisabled([!data.result.newProduct, false])
				setValue("name", data.result.name)
				setValue("Category", data.result.Category)
				setValue("mass", data.result.mass)
			}
		}
		if (Scanned.length >= minCodeLength) asyncData()
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
								reset()
							}}
							id="puta"
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
