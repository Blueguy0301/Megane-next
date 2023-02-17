/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import type { checkoutProducts } from "@app/types"
import type { storeProductScanner } from "@responses"
import { useEffect, useMemo, useState, useRef } from "react"
import Button from "@components/Button"
import Scanner from "@components/Scanner"
import useModal from "@components/useModal"
import Product from "./Product"
import ModalForm from "./Modal"
import { scannerRequest } from "./request"
import { minCodeLength } from "@pages/types"
function page() {
	const { Modal, Open, setIsOpen } = useModal()
	const [products, setProducts] = useState<checkoutProducts[]>([])
	const [quantity, setQuantity] = useState(1)
	const [barcode, setBarcode] = useState("none")
	const [modalOpened, setModalOpened] = useState<string | undefined>()
	const audio = useRef(
		typeof Audio !== "undefined" ? new Audio("/assets/success.mp3") : undefined
	)
	//* memoize this
	let lastCode = ""
	const [error, setError] = useState({})
	const scannerController = new AbortController()
	const fetchData = async () => {
		const response = await scannerRequest(barcode, scannerController)
		if ("e" in response) return
		const { data } = response
		if ("error" in data) return setError({ error: error })
		const { result, error: serverError } = response.data as storeProductScanner
		if (serverError) return setError({ error: serverError })
		if (!result || Object.keys(result).length === 0)
			return setError({ error: "No product found" })
		const { name, mass, price, productStoreId } = result
		audio.current?.play()
		setProducts((prev) => {
			const existingProductIndex = prev.findIndex(
				(v) => v.productStoreId === productStoreId
			)
			if (existingProductIndex >= 0) {
				return prev.map((v, i) => {
					if (i === existingProductIndex) {
						return { ...v, quantity: v.quantity + quantity }
					}
					return v
				})
			}
			return [...prev, { name, price, productStoreId, mass, quantity }]
		})
		setBarcode("")
		setIsOpen(false)
	}
	const Total = useMemo(
		() => products.reduce((a: any, b: any) => a + b.price * b.quantity, 0),
		[products]
	)
	useEffect(() => {
		const scanButton = document.getElementsByClassName("scan")[0] as HTMLElement
		scanButton.style.opacity = "0"
		scanButton.style.visibility = "hidden"
		return () => {
			scanButton.style.visibility = "visible"
			scanButton.style.opacity = "1"
		}
	}, [])
	//? can use useMemo instead of useEffect for better performance?
	//todo : no to optimistic request.
	useEffect(() => {
		if (barcode !== lastCode && barcode !== "none" && barcode.length >= minCodeLength) {
			fetchData()
			lastCode = barcode
		}
		setError({})
		return () => {
			scannerController.abort()
		}
	}, [barcode])
	return (
		<div className="page flex-col-reverse flex-wrap md:flex-row md:flex-nowrap">
			<ModalForm
				Modal={Modal}
				Total={Total}
				modalOpened={modalOpened}
				barcode={barcode}
				setBarcode={setBarcode}
				error={error}
				products={products}
			/>
			<div className="min-w-1/2 flex flex-grow flex-col p-4 md:max-w-[50%]">
				<div className="relative flex flex-grow flex-col gap-4 border border-solid border-white p-4">
					<h3 className="float">Product</h3>
					<div className="z-10 flex h-full w-full flex-col">
						<div className="products flex flex-grow flex-col gap-2 md:gap-4">
							{products.map((product, i) => {
								return (
									<Product
										product={`${product.name} (${product.mass})`}
										price={product.price}
										qty={product.quantity}
										key={i}
										onDelete={() => {
											setProducts((prev) => prev.filter((_, index) => i !== index))
										}}
									/>
								)
							})}
						</div>
						<div className="total mt-auto  flex border-t p-4">
							<h4>Total : </h4>
							<h4 className="ml-auto">{Total}</h4>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-wrap gap-4 pt-3">
					<Open className="green flex-grow" onClick={() => setModalOpened("checkOut")}>
						Checkout
					</Open>
					<Open className="flex-grow" onClick={() => setModalOpened("Manual Add")}>
						Manual Add
					</Open>
					<Button className=" red flex-grow">Cancel</Button>
				</div>
			</div>
			<div className="min-w-1/2 flex flex-grow flex-col p-4 md:max-w-[50%]">
				<h4>Quantity : </h4>
				<div className="flex items-center justify-center gap-4">
					<Button
						type="button"
						onClick={() => {
							setQuantity((prev) => prev + 1)
						}}
					>
						+
					</Button>
					<h4>{quantity}</h4>
					<Button
						type="button"
						onClick={() => {
							setQuantity((prev) => (prev - 1 > 0 ? prev - 1 : 1))
						}}
					>
						-
					</Button>
				</div>
				<Scanner setLastCode={setBarcode} />
				<h4> Last barcode : {barcode}</h4>
			</div>
		</div>
	)
}

export default page
