/* eslint-disable react-hooks/exhaustive-deps */
"use client"
///todo : refetch data when mounted
import TablePagination from "@components/TablePagination"
import { ChangeEvent, useState } from "react"
import Button from "@components/Button"
import Image from "next/image"
import { useMemo, useCallback } from "react"

interface data {
	id: string
	name: string
	_count: {
		Installments: number
		Invoices: number
		productStore: number
		users: number
	}
}
interface props {
	data: data[]
}
function Table({ data }: props) {
	//* memoize this
	const [Stores, setStores] = useState(data)
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState<string[]>([])
	const shownStores = useMemo(() => {
		if (search === "") return Stores
		// else return searchInvoice(search, Invoice) as data[]
	}, [search, Stores])
	const selectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) setSelected(Stores.map((d) => d.id))
		else setSelected([])
	}, [])
	const select = useCallback((id: string) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) setSelected((prev) => [...prev, id])
			else setSelected((prev) => prev.filter((prevId) => prevId !== id))
		}
	}, [])
	const handleDelete = async () => {}
	return (
		<>
			<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3  ">
				<Button className="green">New Store</Button>
				<Button className="red">Delete Selected</Button>
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
									className="px-6 py-4 text-center text-sm font-medium text-white"
								>
									Store Name
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white"
								>
									Total Users
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white "
								>
									Products Registered
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white "
								>
									Total Invoices
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white "
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{shownStores?.map((store, a) => (
								<tr
									className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
									key={a}
								>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-white">
										<input
											type="checkbox"
											name="selected"
											onChange={select(store.id)}
											checked={selected.includes(store.id)}
										/>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										{store.name}
									</td>

									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										{store._count.users}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										{store._count.productStore}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										{store._count.Invoices}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										<Button type="button" className="green">
											New User
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<TablePagination
				shown={Stores.length}
				current={50 > Stores.length ? 1 : Stores.length - 49}
			/>
		</>
	)
}

export default Table
