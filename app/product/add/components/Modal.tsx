"use client"
import Scanner from "@components/Scanner"
import Button from "@components/Button"
import type { addProps } from "../../../interface"
const Modal = (props: addProps) => {
	const { Modal, Scanned, setScanned, errors, scanPressed } = props
	const genRanHex = (size = 2) =>
		Math.floor(
			Math.pow(10, size - 1) +
				Math.random() * (Math.pow(10, size) - Math.pow(10, size - 1) - 1)
		).toString()
	if (!scanPressed) {
		return (
			<Modal title="Error" hideConfirm>
				<p>The following are required:</p>
				<ul className="list-inside list-disc px-4 pb-4">
					{errors.name?.message && <li className="text-lg text-white">Name</li>}
					{errors.mass?.message && <li className="text-lg text-white">Quantity</li>}
					{errors.Category?.message && <li className="text-lg text-white">Category</li>}
					{errors.price?.message && <li className="text-lg text-white">Price</li>}
					{errors.location?.message && <li className="text-lg text-white">Location</li>}
					{errors.description?.message && (
						<li className="text-lg text-white">Description</li>
					)}
				</ul>
			</Modal>
		)
	} else
		return (
			<Modal title="Scan" className="flex flex-col gap-4" hideConfrim={true}>
				<div className="flex flex-row flex-wrap">
					<div className="min-w-[50%] flex-grow">
						<Scanner setLastCode={setScanned} addChecking={true} />
					</div>
					<div className="flex min-w-[50%] max-w-full flex-grow  flex-row flex-wrap items-center justify-center gap-4 md:flex-col">
						<div className="w-full text-center">
							<h3>Scanned:</h3>
							<p>{Scanned ?? "none"} </p>
						</div>
						<Button
							className="green w-full"
							onClick={(e) => {
								setScanned(genRanHex(12))
								props.setIsOpen && props.setIsOpen(false)
							}}
						>
							Generate Instead
						</Button>
					</div>
				</div>
			</Modal>
		)
}

export default Modal
