/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { ChangeEvent, useState } from "react"
import useModal from "./components/useModal"
import Scanner from "./components/Scanner"

const page = () => {
	const [selected, setSelected] = useState("Cash")
	const { Open, Modal } = useModal()
	const handlechange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		let { name, value } = event.target
		setSelected(value)
	}
	return (
		<div>
			<Open></Open>
			<Modal title="Checkout Information" className="relative flex flex-wrap py-10">
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
									onChange={handlechange}
									defaultChecked={selected === "Cash"}
								/>
								<label htmlFor="Cash">Cash</label>
								<input
									type="radio"
									name="PaymentOption"
									id="Installment"
									value="Installment"
									onChange={handlechange}
									defaultChecked={selected !== "Cash"}
								/>
								<label htmlFor="Installment">Installment</label>
							</div>
						</div>
					</fieldset>
					<fieldset disabled={selected === "Cash"} className="customer">
						<div className="checkout group">
							<label htmlFor="CustomerName">Customer's Name</label>
							<input type="text" id="CustomerName" />
						</div>
					</fieldset>

					<div className="checkout group relative flex-grow">
						<label htmlFor="">Amount Paid:</label>
						<div className="relative flex flex-grow items-center gap-2">
							<p>PHP</p>
							<input type="number" className="w-full" placeholder="0.00" />
							<button
								type="button"
								className="scan-btn"
								onClick={() => console.log("onclick exact amount")}
							>
								Exact
							</button>
						</div>
					</div>
					<div className="relative mt-10 box-border flex flex-grow border border-solid border-white">
						<h3 className="float checkout">Sumarry</h3>
						<div className="z-10 flex w-full flex-col items-center justify-evenly  p-5">
							<span className="info flex flex-row gap-3">
								<h4>Product Name</h4>
								<h5>Lorem, ipsum.</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Barcode</h4>
								<h5>Lorem, ipsum.</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Category</h4>
								<h5>Lorem, ipsum.</h5>
							</span>

							<span className="info flex flex-row gap-3">
								<h4>Price</h4>
								<h5>Lorem, ipsum.</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Raw Price</h4>
								<h5>Lorem, ipsum.</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Location</h4>
								<h5>Lorem, ipsum.</h5>
							</span>
							<span className="info flex flex-row gap-3">
								<h4>Description</h4>
								<h5>Lorem, ipsum.</h5>
							</span>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default page
