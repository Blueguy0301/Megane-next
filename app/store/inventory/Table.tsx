/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import TablePagination from "./TablePagination"
import { useState } from "react"
import searchProducts from "./binarySearch"
import type { Session } from "next-auth"
import Button from "@components/Button"
import Image from "next/image"
import { authority } from "../../../pages/interface"
import { useMemo, useCallback } from "react"
interface data {
	Location: string
	price: number
	Product: {
		name: string
		mass: string
		barcode: string
	}
}
interface props {
	data: data[]
	session: Session
}
function Table({ data, session }: props) {
	const [current, setCurrent] = useState(0)
	//* memoize this
	const [product, setProduct] = useState(data)
	const [search, setSearch] = useState("")
	const shownProduct = useMemo(() => {
		if (search === "") return product as unknown as data[]
		else return searchProducts(search, product) as data[]
	}, [search])
	return (
		<>
			<div className="flex w-full flex-row flex-wrap justify-center gap-3 ">
				{session?.user.authorityId >= authority.storeOwner && (
					<>
						<Button
							type="Link"
							href="/product/add"
							className="flex items-center justify-center"
						>
							Add Product
						</Button>
						<Button type="button">Delete Selected</Button>
						<Button type="button">Update Existsing</Button>
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
									<input type="checkbox" name="all" id="all" />
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
									onClick={(e) => {
										console.log(`${a} has been clicked`)
									}}
								>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-white">
										<input type="checkbox" name="selected" />
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
										{i.price}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<TablePagination
				shown={data.length}
				current={50 > data.length ? 1 : data.length - 49}
			/>
		</>
	)
}

export default Table
