"use client"
import { useEffect, useState } from "react"
import Scanner from "@components/Scanner"
import Button from "@components/Button"
import type { addProps } from "../../interface"
const Modal = (props: addProps) => {
	const { Modal, Scanned, setScanned } = props
	const genRanHex = (size = 2) =>
		[...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")
	useEffect(() => {
		//* add request here everytime that the scanned value is changed
	}, [Scanned])
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
