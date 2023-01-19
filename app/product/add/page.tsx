/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import type { ChangeEvent } from "react"
import { useState } from "react"
import Button from "../../components/Button"
import useModal from "../../components/useModal"
import ModalScanner from "./Modal"
import Select from "./Select"
type formData = {
	name: string
	Category: string
	price: number | string
	location: string
	mass: string
	description: string
}
export default function page() {
	const [formData, setFormData] = useState<formData>({
		name: "",
		Category: "",
		price: (0).toFixed(2),
		location: "",
		mass: "",
		description: "",
	})
	const [Scanned, setScanned] = useState("none")
	const unit = formData.Category === "bottle" ? "weight" : "Volume"
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => {
			return { ...prev, [name]: value }
		})
	}
	const { Modal, Open } = useModal()
	return (
		<div className="page box-border flex-wrap">
			<ModalScanner Modal={Modal} Scanned={Scanned} setScanned={setScanned} />
			{/* forms */}
			<form
				action="#"
				method="post"
				className="box-border flex  min-w-[50%] flex-grow flex-col gap-3"
			>
				<fieldset className="min-w-1/2 flex flex-col p-4">
					<div className="relative flex flex-col gap-4 border border-solid border-white p-4">
						<h3 className="float">Type</h3>
						<div className="group">
							<label htmlFor="name">Name</label>
							<input
								type="text"
								name="name"
								id="name"
								value={formData.name}
								onChange={handleChange}
							/>
						</div>
						<div className="group ">
							<label htmlFor="barcode">Barcode</label>
							<div className="relative flex-grow">
								<input
									type="text"
									className="w-full"
									value={Scanned === "none" ? "" : Scanned}
									onChange={(e) => setScanned(e.target.value)}
									id="barcode"
								/>
								<Open className="scan-btn">Scan</Open>
							</div>
						</div>
						<div className="group">
							<label htmlFor="category">Category</label>
							<Select
								selected={formData.Category}
								setSelected={setFormData}
								name="category"
								id="category"
							/>
						</div>
						<div className="group">
							<label htmlFor="unit">{unit}</label>
							<input
								type="text"
								value={formData.mass}
								onChange={handleChange}
								name="mass"
							/>
						</div>
					</div>
				</fieldset>
				<fieldset className="min-w-1/2 flex flex-col p-4">
					<div className="relative flex flex-col gap-4 border border-solid border-white p-4">
						<h3 className="float">Sales information</h3>
						<div className="group">
							<label htmlFor="price">Price</label>
							<input
								type="number"
								id="price"
								value={formData.price}
								onChange={handleChange}
								name="price"
								pattern="^\d+(\.\d{1,2})?$"
							/>
						</div>

						<div className="group">
							<label htmlFor="location">Loaction</label>
							<input
								type="text"
								id="location"
								value={formData.location}
								onChange={handleChange}
								name="location"
							/>
						</div>
						<div className="group">
							<label htmlFor="desc">Description</label>
							<input
								type="text"
								id="desc"
								value={formData.description}
								onChange={handleChange}
								name="description"
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
			<div className="flex max-w-[100%] flex-grow  p-4 md:min-w-[50%] md:max-w-[50%]">
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
