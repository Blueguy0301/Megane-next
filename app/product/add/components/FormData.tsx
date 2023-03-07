"use client"
import React from "react"
import { formData } from "@app/types"

const FormData = (props: { formData: formData; Scanned: string }) => {
	const { formData, Scanned } = props
	return (
		<div className="flex w-full max-w-[100%] flex-grow  p-4 md:min-w-[50%] md:max-w-[50%]">
			<div className="relative box-border flex flex-grow border border-solid border-white">
				<h3 className="float">Product Information</h3>
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
						<h4>Quantity</h4>
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
			</div>
		</div>
	)
}

export default FormData
