/* eslint-disable react-hooks/exhaustive-deps */
"use client"
///todo : refetch data when mounted
import type { Session } from "next-auth"
import type { ChangeEvent } from "react"
import { authority } from "@pages/types"
import { useMemo, useState, useCallback } from "react"
import Image from "next/image"
import TablePagination from "@components/TablePagination"
import Button from "@components/Button"
import useModal from "@components/useModal"
import Table from "@components/Table"
import searchProducts from "./productSearch"
import UpdateModal from "./UpdateModal"
import { remove, update } from "./requst"
interface data {
	Location: string
	price: number
	Product: {
		name: string
		mass: string
		barcode: string
	}
	id: string
}
interface props {
	data: data[]
	session: Session
}
type selectData = { price?: number; location?: string; pId?: string }
function UserInfo({ data, session }: props) {
	const [current, setCurrent] = useState(1)
	//* memoize this
	const [product, setProduct] = useState(data)
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState<string[]>([])
	const shownProduct = useMemo(() => {
		if (search === "") return product
		else return searchProducts(search, product) as data[]
	}, [search])
	const selectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) setSelected(product.map((d) => d.id))
		else setSelected([])
	}, [])
	const select = useCallback((product: data) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) {
				setSelected((prev) => [...prev, product.id])
				setUpdateSelect({
					pId: product.id,
					price: product.price,
					location: product.Location,
				})
			} else setSelected((prev) => prev.filter((prevId) => prevId !== product.id))
		}
	}, [])
	const [updateSelect, setUpdateSelect] = useState<selectData>({})
	const { Open, Modal, isOpen, setIsOpen } = useModal()
	return (
		<>
			<UpdateModal
				Modal={Modal}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				data={updateSelect}
			/>
			<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3 ">
				{session?.user.authorityId >= authority.storeOwner && (
					<>
						<Button
							type="Link"
							href="/product/add"
							className="flex items-center justify-center"
						>
							Add Product
						</Button>
						<Button
							className=" red disabled:opacity-50"
							disabled={selected.length < 1}
							onClick={() => remove(selected)}
						>
							Delete Selected
						</Button>
						<Open
							type="button"
							className="green disabled:opacity-50"
							disabled={selected.length !== 1}
						>
							Update Existsing
						</Open>
					</>
				)}
				<fieldset className="flex items-center justify-center bg-gray-700 px-3 py-3 md:ml-auto">
					<Image
						src="/search.svg"
						width="27"
						height="27"
						decoding="async"
						alt=""
						className="mr-3"
					/>
					<input
						type="search"
						id="table-search"
						className="ml-auto h-full bg-white/0"
						placeholder="search"
						onChange={(e) => setSearch(e.target.value)}
						value={search}
					/>
				</fieldset>
			</div>
			<Table
				withSelection={true}
				onSelect={(e) => selectAll(e)}
				headers={["name", "Mass", "Barcode", "Location", "Price"]}
			>
				{shownProduct.map((i, a) => (
					<tr
						className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
						key={a}
					>
						<td className="tr-check">
							<input
								type="checkbox"
								name="selected"
								onChange={select(i)}
								checked={selected.includes(i.id)}
							/>
						</td>
						<td className="tr">{i.Product.name}</td>
						<td className="tr">{i.Product.mass}</td>
						<td className="tr">{i.Product.barcode}</td>
						<td className="tr">{i.Location}</td>
						<td className="tr">PHP {i.price}</td>
					</tr>
				))}
			</Table>

			<TablePagination
				shown={product.length}
				current={50 > product.length ? 1 : product.length - 49}
			/>
		</>
	)
}

export default UserInfo
