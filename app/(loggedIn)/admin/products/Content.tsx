"use client"
import Table from "@components/Table"
import type { ChangeEvent } from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import useModal from "@components/useModal"
import { warning, success, failed } from "@components/crudModals"
import { maxPageNumber } from "@app/types"
import Button from "@components/Button"
import { getProductOnly, updateProductCode } from "@components/request"
import ScannerModal from "./ScannerModal"
import TablePagination from "@components/TablePagination"
type data = {
	id: string
	name: string
	barcode: string
	Category: string
	mass: string
}[]
type props = {
	data: data
}
const Content = (props: props) => {
	const { data } = props
	const [products, setProducts] = useState(data)
	const { Modal, Open, setIsOpen } = useModal()
	const [selected, setSelected] = useState<string[]>([])
	const [page, setPage] = useState(1)
	const [Scanned, setScanned] = useState("None")
	const allProducts = useMemo(() => {
		return products
	}, [products])
	const selectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) setSelected(products.map((d) => d.id))
		else setSelected([])
	}, [])
	const select = useCallback((id: string) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) setSelected((prev) => [...prev, id])
			else setSelected((prev) => prev.filter((prevId) => prevId !== id))
		}
	}, [])
	const handleDelete = async () => {
		const modalRes = await warning(`Delete ${selected.length} installments?`)
		if (!modalRes.isConfirmed) return
		const res = true //await removeInstallment(selected)
		//! Do not enable
		// if ("e" in res) return
		// if (res.data.error) return failed(res.data.error)
		// if (res.data.success) {
		// 	//todo :  Refresh or add it to the table
		// 	setProducts((prev) => prev.filter((prevId) => !selected.includes(prevId.id)))
		// 	return success("Successfully Removed.")
		// } else return failed("An error occured.")
	}
	const handleUpdate = async () => {
		const prevBarcode = allProducts.filter((prev) => selected[0] === prev.id)[0].barcode
		const res = await updateProductCode(prevBarcode, Scanned)
		if ("e" in res) return
		if (res.data.error) return failed(res.data.error)
		if (res.data.result) {
			//todo :  Refresh or add it to the table
			setProducts((prev) =>
				prev.map((product) =>
					selected.includes(product.id)
						? { ...product, barcode: Scanned }
						: { ...product }
				)
			)
			return success("Successfully Removed.")
		} else return failed("An error occured.")
	}
	const asyncGetProduct = async () => {
		const res = await getProductOnly(page)
		if ("e" in res) return
		if (res.data.error) return failed(res.data.error)
		if (res.data.result) {
			//todo :  Refresh or add it to the table
			setProducts((prev) => [...prev, ...(res.data.result ?? [])])
		} else return failed("An error occured.")
	}
	useEffect(() => {
		asyncGetProduct()
		return () => {}
	}, [page])

	const firstPage = page * maxPageNumber
	const lastPage = firstPage - maxPageNumber
	const shownProducts = allProducts.slice(lastPage, firstPage)
	// 096785013175
	return (
		<>
			<ScannerModal
				Modal={Modal}
				Scanned={Scanned}
				setIsOpen={setIsOpen}
				setScanned={setScanned}
				onAccept={() => handleUpdate()}
			/>
			<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3 ">
				{
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
							Update
						</Open>
					</>
				}
			</div>
			<Table
				withSelection={true}
				onSelect={(e) => selectAll(e)}
				headers={["name", "Barcode", "Category", "mass", "actions"]}
			>
				{shownProducts?.map((product, a) => (
					<tr
						className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
						key={a}
					>
						<td className="tr-check">
							<input
								type="checkbox"
								name="selected"
								onChange={select(product.id)}
								checked={selected.includes(product.id)}
							/>
						</td>
						<td className="tr">{product.name}</td>
						<td className="tr">{product.barcode}</td>
						<td className="tr">{product.Category}</td>
						<td className="tr">{product.mass}</td>
						<td className="tr">
							<Open
								type="button"
								className="green"
								onClick={() => setSelected([product.id])}
							>
								Update Barcode
							</Open>
						</td>
					</tr>
				))}
			</Table>
			<TablePagination
				shown={allProducts.length % 50 !== 0 ? allProducts.length : firstPage}
				current={lastPage + 1}
				total={allProducts.length || 1}
				setPage={setPage}
				page={page}
			/>
		</>
	)
}

export default Content
