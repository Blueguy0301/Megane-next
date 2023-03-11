"use client"
import type { MouseEventHandler } from "react"
import Button from "@components/Button"
import Image from "next/image"
type props = {
	product: string
	qty: string | number
	price: number
	onDelete?: MouseEventHandler<HTMLButtonElement> | undefined
	change?: any
	[x: string]: any
}
const Product = (props: props) => {
	return (
		<div className="flex w-full items-center justify-center gap-2 md:gap-4 ">
			<Button onClick={props.onDelete} className="red">
				<Image src="/trash.svg" alt="trash" width={16} height={16} className="trash" />
			</Button>
			<p className="">{props.qty ?? 1}x</p>
			<p className="flex-grow">{props.product ?? "Product name"}</p>
			<p>PHP {props.price?.toFixed(2) ?? "0.00"}</p>
		</div>
	)
}

export default Product
