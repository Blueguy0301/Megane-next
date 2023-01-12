/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect, useMemo, useState } from "react"
import Button from "../../components/Button"
import Scanner from "../../components/Scanner"
import Product from "./Product"
import product from "./Product"
function page() {
	const [products, setProducts] = useState(new Array(30).fill(0))
	const [quantity, setQuantity] = useState(99)
	const [barcode, setBarcode] = useState("none")
	const Total = useMemo(() => {
		return products
			.map((product, i) => {
				return i
			})
			.reduce((a: any, b: any) => {
				return a + b
				// return a + b.price * b.quantity
			}, 0)
	}, [products])
	useEffect(() => {
		let scanButton = document.getElementsByClassName("scan")[0] as HTMLElement
		scanButton.style.opacity = "0"
		scanButton.style.visibility = "hidden"
		return () => {
			scanButton.style.visibility = "visible"
			scanButton.style.opacity = "1"
		}
	}, [])
	return (
		<div className="page flex-col-reverse flex-wrap md:flex-row md:flex-nowrap">
			<div className="min-w-1/2 flex flex-grow flex-col p-4 md:max-w-[50%]">
				<div className="relative flex flex-grow flex-col gap-4 border border-solid border-white p-4">
					<h3 className="float">Product</h3>
					<div className="z-10 flex h-full w-full flex-col">
						<div className="products flex flex-grow flex-col gap-2 md:gap-4">
							{products.map((product, i) => {
								return (
									<Product
										product="product Name with a long long name"
										price={30}
										qty={quantity}
										key={i}
										onDelete={() => {
											setProducts((prev) => prev.filter((product, index) => i !== index))
											console.log(`delete ${i}`)
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
					<Button className="flex-grow">Checkout</Button>
					<Button className="flex-grow">Manual Add</Button>
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
				<Scanner />
			</div>
		</div>
	)
}

export default page
