/* eslint-disable react-hooks/exhaustive-deps */
"use client"
///todo : refetch data when mounted
import TablePagination from "@components/TablePagination"
import { ChangeEvent, useState } from "react"
import searchProducts from "./productSearch"
import type { Session } from "next-auth"
import Button from "@components/Button"
import Image from "next/image"
import { authority } from "@pages/types"
import { useMemo, useCallback } from "react"
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
function Table({ data, session }: props) {
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
	const select = useCallback((id: string) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) setSelected((prev) => [...prev, id])
			else setSelected((prev) => prev.filter((prevId) => prevId !== id))
		}
	}, [])
	// use the memo hook here.
	return (
		<>
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
							type="button"
							className=" red disabled:opacity-50"
							disabled={selected.length < 1}
						>
							Delete Selected
						</Button>
						<Button
							type="button"
							className="green disabled:opacity-50"
							disabled={selected.length !== 1}
						>
							Update Existsing
						</Button>
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
			<div className="flex flex-col">
				<div className="max-w-[100%] overflow-auto">
					<table className="min-w-full  bg-gray-800">
						<thead className="border-b bg-white/25">
							<tr>
								<th
									scope="col"
									className="w-4 px-6 py-4 text-center text-sm  font-medium text-white"
								>
									<input
										type="checkbox"
										name="all"
										id="all"
										onChange={(e) => selectAll(e)}
									/>
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-left text-sm font-medium text-white"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-left text-sm font-medium text-white"
								>
									Mass
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-left text-sm font-medium text-white"
								>
									Barcode
								</th>

								<th
									scope="col"
									className="px-6 py-4 text-left text-sm font-medium text-white"
								>
									Location
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-left text-sm font-medium text-white"
								>
									Price
								</th>
							</tr>
						</thead>
						<tbody>
							{shownProduct.map((i, a) => (
								<tr
									className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
									key={a}
								>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-white">
										<input
											type="checkbox"
											name="selected"
											onChange={select(i.id)}
											checked={selected.includes(i.id)}
										/>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
										{i.Product.name}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
										{i.Product.mass}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
										{i.Product.barcode}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
										{i.Location}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
										PHP {i.price}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<TablePagination
				shown={product.length}
				current={50 > product.length ? 1 : product.length - 49}
			/>
		</>
	)
}

export default Table
