"use client"
import type { MouseEventHandler } from "react"
import Button from "@components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
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
			<Button onClick={props.onDelete} className="red rounded-md">
				<FontAwesomeIcon icon={faTrashCan} className="fa-1x" />
			</Button>
			<p className="">{props.qty ?? 1}x</p>
			<p className="flex-grow">{props.product ?? "Product name"}</p>
			<p>PHP {props.price?.toFixed(2) ?? "0.00"}</p>
		</div>
	)
}

export default Product
