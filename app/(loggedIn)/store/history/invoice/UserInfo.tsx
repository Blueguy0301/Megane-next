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
import { convertDate } from "@components/dateformat"
import searchInvoice from "./invoiceSearch"
import { deleteInvoice } from "@components/request"
import { failed, success, warning } from "@components/crudModals"
import Table from "@components/Table"
interface data {
	id: string
	dateTime: string
	total: number
	Installment: string
}
interface props {
	data: data[]
	session: Session
}
function UserInfo({ data, session }: props) {
	//* memoize this
	const [Invoice, setInvoice] = useState(
		data.map((value) => ({
			...value,
			dateTime: convertDate(value.dateTime),
		}))
	)
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState<string[]>([])
	const shownProduct = useMemo(() => {
		if (search === "") return Invoice
		else return searchInvoice(search, Invoice) as data[]
	}, [search, Invoice])
	const selectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) setSelected(Invoice.map((d) => d.id))
		else setSelected([])
	}, [])
	const select = useCallback((id: string) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) setSelected((prev) => [...prev, id])
			else setSelected((prev) => prev.filter((prevId) => prevId !== id))
		}
	}, [])
	const handleDelete = async () => {
		const warningRes = await warning()
		if (!warningRes.isConfirmed) return
		const res = await deleteInvoice(selected)
		if ("e" in res || "error" in res.data) return success()
		if (res.data.success) {
			setInvoice((prev) => prev.filter((data) => !selected.includes(data.id)))
			setSelected([])
			success(`Deleted ${res.data.count} invoices`)
		} else failed("An error occured")
	}
	return (
		<>
			<div className="flex w-full flex-row flex-wrap items-center justify-center  gap-3">
				{session?.user.authorityId >= authority.storeOwner && (
					<>
						{/* todo: disable this button if nothing is selected. */}
						<Button
							type="button"
							disabled={selected.length <= 0}
							className="red disabled:opacity-50"
							onClick={handleDelete}
						>
							Delete Selected
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
			<Table
				withSelection={true}
				onSelect={(e) => selectAll(e)}
				headers={["Total", "Date", "Buyer", "Action"]}
			>
				{shownProduct.map((invoice, a) => (
					<tr
						className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
						key={a}
					>
						<td className="tr-check">
							<input
								type="checkbox"
								name="selected"
								onChange={select(invoice.id)}
								checked={selected.includes(invoice.id)}
							/>
						</td>
						<td className="tr">{invoice.total}</td>
						<td className="tr">{invoice.dateTime}</td>
						<td className="tr">{invoice.Installment}</td>
						<td className="tr">
							<Button
								type="Link"
								href={`/store/history/invoice/${invoice.id}`}
								disabled={invoice.id ? false : true}
								className="disabled:opacity-50"
							>
								View
							</Button>
						</td>
					</tr>
				))}
			</Table>
			<TablePagination
				shown={Invoice.length}
				current={50 > Invoice.length ? 1 : Invoice.length - 49}
			/>
		</>
	)
}

export default UserInfo
