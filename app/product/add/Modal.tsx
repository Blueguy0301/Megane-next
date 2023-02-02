"use client"
import type { ReactNode, MouseEventHandler, Dispatch, SetStateAction } from "react"
import Scanner from "@components/Scanner"
import Button from "@components/Button"
type Props = {
	Modal: (props: {
		title: string
		children: ReactNode
		onAccept?: MouseEventHandler
		confirmText?: string | number
		[x: string]: any
	}) => JSX.Element
	Scanned: string
	setScanned: Dispatch<SetStateAction<string>>
}

const Modal = (props: Props) => {
	const { Modal, Scanned, setScanned } = props
	const genRanHex = (size = 2) =>
		[...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")
	return (
		<Modal title="Scan" className="flex flex-col gap-4">
			<div className="flex flex-row flex-wrap">
				<div className="min-w-[50%] flex-grow">
					<Scanner setLastCode={setScanned} />
				</div>
				<div className="flex min-w-[50%] max-w-full flex-grow  flex-row flex-wrap items-center justify-center gap-4 md:flex-col">
					<div className="w-full text-center">
						<h3>Scanned:</h3>
						<p>{Scanned ?? "none"} </p>
					</div>
					<Button className="green w-full" onClick={(e) => setScanned(genRanHex(8))}>
						Generate Instead
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default Modal
