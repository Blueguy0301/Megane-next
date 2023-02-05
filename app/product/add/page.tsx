/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, useEffect } from "react"
import Button from "@components/Button"
import useModal from "@components/useModal"
import { formData } from "../../interface"
import { useForm, SubmitHandler } from "react-hook-form"
import ModalScanner from "./components/Modal"
import ProductForm from "./components/ProductForm"
import FormData from "./components/FormData"
import { sendData } from "./components/request"
export default function page() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		reset,
	} = useForm<formData>()

	// todo : find a way to get the data from scanner, to here
	//* idea one : do it in the backend. send a isStoreNew and isNew params inside the json.
	const [isStoreNew, setIsStoreNew] = useState(true)
	const [isNew, setIsNew] = useState(false)
	const [fetchData, setFetchData] = useState({})
	const onSubmit: SubmitHandler<formData> = (data) => {
		//* submit to api here.
		console.log("ran")
		sendData(data, isStoreNew, Scanned)
	}
	const formData = watch()
	const [Scanned, setScanned] = useState("none")
	const { Modal, Open } = useModal()
	const { Modal: ErrorModal, setIsOpen, isOpen } = useModal()
	return (
		<div className="page box-border flex-wrap">
			<ModalScanner Modal={Modal} Scanned={Scanned} setScanned={setScanned} />
			<ErrorModal title="Error">
				<p>The following are required:</p>
				<ul className="list-inside list-disc px-4 pb-4">
					{errors.name?.message && <li className="text-lg text-white">Name</li>}
					{errors.mass?.message && <li className="text-lg text-white">Quantity</li>}
					{errors.price?.message && <li className="text-lg text-white">Price</li>}
					{errors.location?.message && <li className="text-lg text-white">Location</li>}
					{errors.description?.message && (
						<li className="text-lg text-white">Description</li>
					)}
				</ul>
			</ErrorModal>
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
					disabled={false}
				/>
				<fieldset className="min-w-1/2 flex flex-col p-4 disabled:opacity-50">
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
				<div className="mt-auto flex flex-wrap items-center justify-center gap-4 p-4">
					<Button
						className="flex-grow"
						type="submit"
						onClick={(e) => {
							if (!(Object.keys(errors).length === 0) && !isOpen) {
								setIsOpen(!isOpen)
							} else setIsOpen(false)
						}}
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
					>
						Reset
					</Button>
				</div>
			</form>
			<FormData Scanned={Scanned} formData={formData} />
		</div>
	)
}
