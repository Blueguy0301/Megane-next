"use client"
import React from "react"
import Select from "./Select"
type props = {
	[x: string]: any
}
const ProductForm = (props: props) => {
	const { register, setScanned, setValue, Scanned, Open, disabled } = props
	return (
		<fieldset
			className="min-w-1/2 flex flex-col p-4 disabled:opacity-50"
			disabled={disabled}
		>
			<div className="relative flex flex-col gap-4 border border-solid border-white p-4">
				<h3 className="float">Type</h3>
				<div className="group">
					<label htmlFor="name">Name</label>
					<input type="text" id="name" {...register("name", { required: true })} />
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
					<label htmlFor="Category">Category</label>
					<Select {...register("Category", { required: true })} setValue={setValue} />
				</div>
				<div className="group">
					<label htmlFor="unit">Quantity</label>
					<input type="text" {...register("mass", { required: true })} id="unit" />
				</div>
			</div>
		</fieldset>
	)
}

export default ProductForm
