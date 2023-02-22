/* eslint-disable react-hooks/exhaustive-deps */
"use client"
///todo : refetch data when mounted
import TablePagination from "@components/TablePagination"
import { ChangeEvent, useState } from "react"
import type { Session } from "next-auth"
import Button from "@components/Button"
import Image from "next/image"
import { authority } from "@pages/types"
import { useMemo, useCallback } from "react"
import useModal from "@components/useModal"
import ModalForms from "./ModalForms"
interface data {
	total: number
	customerName: string
	InvoiceCount: number
	id: string
}
interface props {
	data: data[]
	session: Session
}
type forms = {
	name: string
	amount: number
}
function Table({ data, session }: props) {
	//* memoize this
	const installments = data
	const { Modal, Open, isOpen } = useModal()
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState<string[]>([])
	const [modalOpened, setModalOpened] = useState("")
	const shownProduct = useMemo(() => {
		if (search === "") return installments
		// else return searchInvoice(search, Invoice) as data[]
		return installments
	}, [search])
	const selectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) setSelected(installments.map((d) => d.id))
		else setSelected([])
	}, [])
	const select = useCallback((id: string) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) setSelected((prev) => [...prev, id])
			else setSelected((prev) => prev.filter((prevId) => prevId !== id))
		}
	}, [])

	return (
		<>
			<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3">
				{session?.user.authorityId >= authority.storeOwner && (
					<>
						<Button
							type="button"
							disabled={selected.length <= 0}
							className="red disabled:opacity-50"
						>
							Delete Selected
						</Button>
					</>
				)}
				<ModalForms modal={Modal} modalOpened={modalOpened} isOpen={isOpen} />
				<Open onClick={() => setModalOpened("add")} className="green">
					New Installment
				</Open>
				<fieldset className="flex items-center justify-center bg-gray-700 px-3 py-3 md:ml-auto">
					<Image
						src="/search.svg"
						width="27"
						height="27"
						decoding="async"
						alt="Search"
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
									className="px-6 py-4 text-center text-sm font-medium text-white "
								>
									Buyer
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white"
								>
									Invoices
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white"
								>
									Unpaid
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white"
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{shownProduct.map((invoice, a) => (
								<tr
									className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
									key={a}
								>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-white">
										<input
											type="checkbox"
											name="selected"
											onChange={select(invoice.id)}
											checked={selected.includes(invoice.id)}
										/>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										{invoice.customerName}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										{invoice.InvoiceCount}
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										{invoice.total}
									</td>
									<td className="flex items-center justify-center gap-4 whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white">
										<Button type="Link" href={`/store/history/installment/${invoice.id}`}>
											View
										</Button>
										<Open onClick={() => setModalOpened("update")} className="green">
											Update
										</Open>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<TablePagination
				shown={installments.length}
				current={50 > installments.length ? 1 : installments.length - 49}
			/>
		</>
	)
}

export default Table
