"use client"
import { convertDate } from "@components/dateformat"
import Button from "@components/Button"
type props = {
	data?: {
		id: string
		total: number
		dateTime: Date
	}[]
}
const Table = (props: props) => {
	const { data } = props

	return (
		<div className="flex flex-col">
			<div className="max-w-[100%] overflow-auto">
				<table className="min-w-full  bg-gray-800">
					<thead className="border-b bg-white/25">
						<tr>
							<th
								scope="col"
								className="px-6 py-4 text-left text-sm font-medium text-white"
							>
								Transaction Date
							</th>
							<th
								scope="col"
								className="px-6 py-4 text-center text-sm font-medium text-white"
							>
								Invoice Total
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
						{!data || data.length <= 0 ? (
							<tr className="border-b transition duration-300 ease-in-out hover:bg-gray-600">
								<td
									className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white"
									colSpan={3}
								>
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
										<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white ">
											{convertDate(invoice.dateTime)}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light  text-white">
											PHP {invoice.total}
										</td>
										<td className="flex justify-center gap-4 whitespace-nowrap px-6 py-4">
											<Button type="Link" href={`/store/history/invoice/${invoice.id}`}>
												View
											</Button>
											<Button
												type="Link"
												href={`/store/history/invoice/${invoice.id}`}
												className="red"
											>
												Delete
											</Button>
										</td>
									</tr>
								)
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Table
