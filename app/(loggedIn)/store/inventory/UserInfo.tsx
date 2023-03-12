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
import { removeProduct } from "@components/request"
import searchProducts from "./productSearch"
import UpdateModal from "./UpdateModal"
import { failed, success, warning } from "@components/crudModals"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
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
type update = {
	price: number
	Location: string
	Description: string
	productStoreId: string
	productId: string
}
interface props {
	data: data[]
	session: Session
}
type selectData = {
	price?: number
	location?: string
	pId?: string
}
function UserInfo({ data, session }: props) {
	const [current, setCurrent] = useState(1)
	//* memoize this
	const [product, setProduct] = useState(data)
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState<string[]>([])
	const shownProduct = useMemo(() => {
		if (search === "") return product
		else return searchProducts(search, product) as data[]
	}, [search, product])
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
	const handleUpdate = (d: update) => {
		setProduct((prev) =>
			prev.map((value) => {
				if (value.id === d.productStoreId) {
					return {
						Location: d.Location,
						price: d.price,
						Product: value.Product,
						id: d.productStoreId,
					}
				}
				return value
			})
		)
	}
	const handleDelete = async () => {
		const userRes = await warning(`Delete ${selected.length} product/s`)
		if (!userRes.isConfirmed) return
		const res = await removeProduct(selected)
		console.log(res)
		if ("e" in res) return failed(res.e)
		if (res.data.error) return failed(res.data.error)
		if (res.data.success) {
			setProduct((prev) => prev.filter((d) => !selected.includes(d.id)))
			return success(`Deleted ${selected.length} product/s`)
		} else return failed("An error occured")
	}
	const [updateSelect, setUpdateSelect] = useState<selectData>({})
	const { Open, Modal, isOpen, setIsOpen } = useModal()
	return (
		<>
			<UpdateModal
				Modal={Modal}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				data={updateSelect}
				onUpdate={handleUpdate}
			/>
			<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3 ">
				{session?.user.authorityId >= authority.storeOwner && (
					<>
						<Button
							type="Link"
							href="/store/add"
							className="flex items-center justify-center"
						>
							Add Product
						</Button>
						<Button
							className=" red disabled:opacity-50"
							disabled={selected.length < 1}
							onClick={handleDelete}
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
					<FontAwesomeIcon icon={faSearch} className="mr-3" inverse />
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
