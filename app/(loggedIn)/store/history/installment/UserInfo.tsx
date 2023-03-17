/* eslint-disable react-hooks/exhaustive-deps */
"use client"
///todo : refetch data when mounted
import TablePagination from "@components/TablePagination"
import TableData from "@components/Table"
import { ChangeEvent, useState } from "react"
import type { Session } from "next-auth"
import Button from "@components/Button"
import { authority } from "@pages/types"
import { useMemo, useCallback } from "react"
import useModal from "@components/useModal"
import ModalForms from "./ModalForms"
import { removeInstallment } from "@components/request"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { failed, success, warning } from "@components/crudModals"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { maxPageNumber } from "@app/types"
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
function UserInfo({ data, session }: props) {
	//* memoize this
	const [installments, setInstallments] = useState(data)
	const { Modal, Open, isOpen } = useModal()
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState<string[]>([])
	const [modalOpened, setModalOpened] = useState("")
	const [id, setId] = useState("")
	const [page, setPage] = useState(1)
	const allInstallments = useMemo(() => {
		if (search === "") return installments
		// else return searchInvoice(search, Invoice) as data[]
		return installments
	}, [search, installments])
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
	const handleRemove = async () => {
		const modalRes = await warning(`Delete ${selected.length} installments?`)
		if (!modalRes.isConfirmed) return
		const res = await removeInstallment(selected)
		if ("e" in res) return
		if (res.data.error) return failed(res.data.error)
		if (res.data.success) {
			//todo :  Refresh or add it to the table
			setInstallments((prev) => prev.filter((prevId) => !selected.includes(prevId.id)))
			return success("Successfully Removed.")
		} else return failed("An error occured.")
	}
	const handleUpdate = (newInvoice: data) => {
		setInstallments((prev) => [
			...prev,
			{
				id: newInvoice.id,
				customerName: newInvoice.customerName,
				total: newInvoice.total,
				InvoiceCount: newInvoice.InvoiceCount ?? 0,
			},
		])
	}
	const firstPage = page * maxPageNumber
	const lastPage = firstPage - maxPageNumber
	const shownInstallments = allInstallments.slice(lastPage, firstPage)
	return (
		<>
			<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3">
				{session?.user.authorityId >= authority.storeOwner && (
					<>
						<Button
							type="button"
							disabled={selected.length <= 0}
							className="red disabled:opacity-50"
							onClick={handleRemove}
						>
							Delete Selected
						</Button>
					</>
				)}
				<ModalForms
					modal={Modal}
					modalOpened={modalOpened}
					isOpen={isOpen}
					selected={id}
					handleUpdate={handleUpdate}
				/>
				<Open onClick={() => setModalOpened("add")} className="green">
					New Installment
				</Open>

				<fieldset className="flex items-center justify-center bg-gray-700 px-3 py-1 md:ml-auto">
					<FontAwesomeIcon icon={faSearch} className="mr-3" inverse />
					<input
						type="search"
						id="table-search"
						className="ml-auto h-full bg-white/0 px-3 py-2"
						placeholder="search"
						onChange={(e) => setSearch(e.target.value)}
						value={search}
					/>
				</fieldset>
			</div>
			<TableData
				headers={["Buyer", "Invoices", "Unpaid", "Action"]}
				withSelection={true}
				onSelect={(e) => selectAll(e)}
			>
				{shownInstallments.map((installment, a) => (
					<tr
						className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
						key={a}
					>
						<td className="tr-check">
							<input
								type="checkbox"
								name="selected"
								onChange={select(installment.id)}
								checked={selected.includes(installment.id)}
							/>
						</td>
						<td className="tr">{installment.customerName}</td>
						<td className="tr">{installment.InvoiceCount}</td>
						<td className="tr">{installment.total}</td>
						<td className="tr flex items-center justify-center gap-4">
							<Button type="Link" href={`/store/history/installment/${installment.id}`}>
								View
							</Button>
							<Open
								onClick={() => {
									setModalOpened("update")
									setId(installment.id)
								}}
								className="green"
							>
								Update
							</Open>
						</td>
					</tr>
				))}
			</TableData>
			<TablePagination
				shown={allInstallments.length % 50 !== 0 ? allInstallments.length : page}
				current={lastPage + 1}
				total={allInstallments.length || 1}
				setPage={setPage}
				page={page}
			/>
		</>
	)
}

export default UserInfo
