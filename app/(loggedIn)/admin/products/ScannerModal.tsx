import { modal } from "@app/types"
import Button from "@components/Button"
import Scanner from "@components/Scanner"
import type { Dispatch, MouseEventHandler, SetStateAction } from "react"
type props = {
	Modal: modal
	setScanned: Dispatch<SetStateAction<string>>
	Scanned: string
	setIsOpen: Dispatch<SetStateAction<boolean>>
	onAccept?: MouseEventHandler
}
const ScannerModal = (props: props) => {
	const genRanHex = (size: number) =>
		Math.floor(
			Math.pow(10, size - 1) +
				Math.random() * (Math.pow(10, size) - Math.pow(10, size - 1) - 1)
		).toString()
	const { Modal, setScanned, Scanned } = props
	return (
		<Modal
			title="Scan"
			className="flex flex-col gap-4"
			hideConfrim={true}
			onAccept={props.onAccept}
		>
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
						}}
					>
						Generate Instead
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default ScannerModal
