/* eslint-disable react-hooks/exhaustive-deps */
"use client"
///todo : refetch data when mounted
import TablePagination from "@components/TablePagination"
import { ChangeEvent, useState } from "react"
import Button from "@components/Button"
import Image from "next/image"
import { useMemo, useCallback } from "react"
import useModal from "@components/useModal"
import Table from "@components/Table"
import UserModal from "./UserModal"
import { addUser, newStore } from "./adminRequests"
import { success, failed } from "@components/crudModals"
import { userDetails } from "@pages/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
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
type handleUser = {
	[x: string]: string
}
interface props {
	data: data[]
}
function Content({ data }: props) {
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
	const [modalOpened, setModalOpened] = useState<"Store" | "User">("Store")
	const { Modal, Open, isOpen, setIsOpen } = useModal()

	const userSelected = async (storeId: string) => {
		setModalOpened("User")
		setSelected([storeId])
	}
	const handleDelete = async () => {
		console.log("delete", selected)
	}
	const handleStore = async (name: { storeName: string }) => {
		const res = await newStore(name)
		if ("e" in res) return failed(res.e)
		if (res.data.error) {
			console.log("pasok")
			console.log(res.data.error)
			return failed(res.data.error)
		}
		if (res.data.result) {
			setStores((prev) => [
				...prev,
				{
					id: res.data.result?.id || "",
					name: res.data.result?.name || "",
					_count: {
						Installments: 0,
						Invoices: 0,
						productStore: 0,
						users: 0,
					},
				},
			])
			setIsOpen(false)
			return success("Added successfully")
		}
	}
	const handleUser = async ({ username, password, authorityId }: handleUser) => {
		const res = await addUser({
			userName: username,
			authorityId: Number(authorityId),
			password: password,
			storeId: selected[0],
		})
		console.log(res)
	}
	return (
		<>
			<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3">
				<UserModal
					isOpen={isOpen}
					Modal={Modal}
					modalOpened={modalOpened}
					handleStore={handleStore}
					handleUser={handleUser}
				/>
				<Open className="green" onClick={() => setModalOpened("Store")}>
					New Store
				</Open>
				<Button
					className="red disabled:opacity-50"
					disabled={selected.length < 1}
					onClick={handleDelete}
				>
					Delete Selected
				</Button>
				<Button type="Link" href="/admin/products">
					Product List
				</Button>
				<fieldset className="flex items-center justify-center bg-gray-700 px-3 py-3 md:ml-auto">
					<FontAwesomeIcon icon={faSearch} className="fa-inverse mr-3" />
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
				headers={[
					"Store name",
					"Total users",
					"Products Registered",
					"Total Invoices",
					"Action",
				]}
				onSelect={(e) => selectAll(e)}
				withSelection={true}
			>
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
							<Open
								type="button"
								className="green"
								onClick={() => userSelected(store.id)}
							>
								New User
							</Open>
						</td>
					</tr>
				))}
				{Stores.length < 1 && <td className="tr">No Data found</td>}
			</Table>
			{/* <TablePagination
				shown={Stores.length}
				current={50 > Stores.length ? 1 : Stores.length - 49}
						page={}
				setPage={}
				total={}
			/> */}
		</>
	)
}

export default Content
