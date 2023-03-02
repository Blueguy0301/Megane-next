//todo : migrate
"use client"
import Table from "@components/Table"
import { convertDate } from "@components/dateformat"
import Button from "@components/Button"
import { deleteInvoice } from "@components/request"
import { deleteFailed, deletePrompt, deleteSuccess } from "../../swalModal"
import { useCallback, useState } from "react"
type props = {
	data?: {
		id: string
		total: number
		dateTime: string
	}[]
}
const UserInfo = (props: props) => {
	const { data: initialData } = props
	const [data, setData] = useState(initialData)
	const handleDelete = useCallback((id: string) => {
		return async () => {
			const modalRes = await deletePrompt("Delete this invoice?")
			if (!modalRes.isConfirmed) return
			const res = await deleteInvoice(id)
			if ("e" in res || "error" in res.data) return
			if (res.data.success) {
				setData((prev) => prev?.filter((invoice) => !data?.includes(invoice)))
				deleteSuccess(res.data.count)
			} else deleteFailed()
		}
	}, [])
	return (
		<Table headers={["Transaction Date", "Invoice Total", "Action"]}>
			{!data || data.length <= 0 ? (
				<tr className="border-b transition duration-300 ease-in-out hover:bg-gray-600">
					<td className="tr" colSpan={3}>
						No Invoices found
					</td>
				</tr>
			) : (
				data?.map((invoice, i) => {
					return (
						<tr
							className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
							key={i}
						>
							<td className="tr">{convertDate(invoice.dateTime)}</td>
							<td className="tr">PHP {invoice.total}</td>
							<td className="tr flex items-center justify-center gap-4">
								<Button type="Link" href={`/store/history/invoice/${invoice.id}`}>
									View
								</Button>
								<Button type="button" onClick={handleDelete(invoice.id)} className="red">
									Delete
								</Button>
							</td>
						</tr>
					)
				})
			)}
		</Table>
	)
}

export default UserInfo
