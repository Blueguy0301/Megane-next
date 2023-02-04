/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { ChangeEvent, useEffect } from "react"
import { useState } from "react"
import Button from "../../components/Button"
import useModal from "../../components/useModal"
import ModalScanner from "./Modal"
import Select from "./Select"
import { formData } from "../../interface"
import { useForm, SubmitHandler } from "react-hook-form"
import ProductForm from "./ProductForm"
export default function page() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<formData>()
	const [isStoreNew, setIsStoreNew] = useState(false)
	const [isNew, setIsNew] = useState(false)
	const onSubmit: SubmitHandler<formData> = (data) => {
		//* submit to api here.
	}
	const formData = watch()
	const [Scanned, setScanned] = useState("none")
	const unit = "Quantity"
	const { Modal, Open } = useModal()
	return (
		<div className="page box-border flex-wrap">
			<ModalScanner Modal={Modal} Scanned={Scanned} setScanned={setScanned} />
			{/* forms */}
			<form
				action="#"
				method="post"
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
								pattern="^\d+(\.\d{1,2})?$"
								min={0}
								{...register("price", { required: true })}
							/>
						</div>
						<div className="group">
							<label htmlFor="location">Loaction</label>
							<input
								type="text"
								id="location"
								{...register("location", { required: true })}
							/>
						</div>
						<div className="group">
							<label htmlFor="desc">Description</label>
							<input
								type="text"
								id="desc"
								{...register("description", { required: true })}
							/>
						</div>
					</div>
				</fieldset>
				<div className="mt-auto flex flex-wrap items-center justify-center gap-4 p-4">
					<Button className="flex-grow"> Add product</Button>
					<Button type="reset" className="red flex-grow">
						Reset
					</Button>
				</div>
			</form>
			{/* product information */}
			<div className="flex w-full max-w-[100%] flex-grow  p-4 md:min-w-[50%] md:max-w-[50%]">
				<div className="relative box-border flex flex-grow border border-solid border-white">
					<h3 className="float">Product Information</h3>
					{formData.name !== "" && (
						<div className="z-10 flex w-full flex-col items-center justify-evenly  p-5">
							<span className="info flex flex-row gap-3">
								<h4>Product Name</h4>
								<h5>{formData.name}</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Barcode</h4>
								<h5>{Scanned}</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Category</h4>
								<h5>{formData.Category}</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>{unit}</h4>
								<h5>{formData.mass}</h5>
							</span>

							<span className="info flex flex-row gap-3">
								<h4>Price</h4>
								<h5>{formData.price}</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Location</h4>
								<h5>{formData.location}</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Description</h4>
								<h5>{formData.description}</h5>
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
