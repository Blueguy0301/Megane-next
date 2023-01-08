import Button from "../../components/Button"

export default function page() {
	const unit = "Volume"
	return (
		<div className="page box-border flex-wrap">
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
							<label htmlFor="">Name</label>
							<input type="text" />
						</div>
						<div className="group ">
							<label htmlFor="">Barcode</label>
							<div className="relative flex-grow">
								<input type="text" className="w-full" />
								<button type="button" className="scan-btn">
									Scan
								</button>
							</div>
						</div>
						<div className="group">
							<label htmlFor="">Category</label>
							<input type="text" />
						</div>
						<div className="group">
							<label htmlFor="">{unit}</label>
							<input type="text" />
						</div>
					</div>
				</fieldset>
				<fieldset className="min-w-1/2 flex flex-col p-4">
					<div className="relative flex flex-col gap-4 border border-solid border-white p-4">
						<h3 className="float">Sales information</h3>
						<div className="group">
							<label htmlFor="">Price</label>
							<input type="text" />
						</div>
						<div className="group">
							<label htmlFor="">Raw price</label>
							<input type="text" />
						</div>
						<div className="group">
							<label htmlFor="">Loaction</label>
							<input type="text" />
						</div>
						<div className="group">
							<label htmlFor="">Description</label>
							<input type="text" />
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
			<div className="flex min-w-[50%] flex-grow  p-4">
				<div className="relative box-border flex flex-grow border border-solid border-white">
					<h3 className="float">Product Information</h3>
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
							<h4>{unit}</h4>
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
		</div>
	)
}
