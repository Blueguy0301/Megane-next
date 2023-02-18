import { authOptions } from "@api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import prisma from "@api/db"
import { convertDate } from "@components/dateformat"
import { notFound } from "next/navigation"
async function getData(params: string) {
	const data = await prisma.invoice
		.findFirst({
			where: {
				id: BigInt(params),
			},
			select: {
				dateTime: true,
				total: true,
				InvoicePurchases: {
					select: {
						quantity: true,
						ProductStore: {
							select: {
								price: true,
								Product: {
									select: { name: true, mass: true },
								},
							},
						},
					},
				},
				Installment: {
					select: {
						customerName: true,
					},
				},
			},
		})
		.then((d) => ({ ...d, dateTime: d?.dateTime.toISOString() }))

	return data
}
const page = async ({ params }: { params: { id: string } }) => {
	const session = getServerSession(authOptions)
	const data = await getData(params.id)
	if (!session) return
	if (!data || !data.InvoicePurchases) return notFound()
	console.log("test")
	return (
		<div className="page flex-col gap-3 p-4">
			<h3>Purchase History</h3>
			<p>Buyer : {data?.Installment?.customerName ?? "Unknown"}</p>
			<p>Total : {data?.total}</p>
			<p>Date Purchased : {convertDate(data?.dateTime as string)} </p>
			<div className="flex flex-col">
				<div className="max-w-[100%] overflow-auto">
					<table className="min-w-full  bg-gray-800">
						<thead className="border-b bg-white/25">
							<tr>
								<th
									scope="col"
									className="px-6 py-4 text-left text-sm font-medium text-white"
								>
									Product
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white"
								>
									Quantity
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-center text-sm font-medium text-white "
								>
									Price
								</th>
							</tr>
						</thead>
						<tbody>
							{data.InvoicePurchases.map((purchase, i) => {
								return (
									<tr
										className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
										key={i}
									>
										<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white ">
											{purchase.ProductStore.Product.name}(
											{purchase.ProductStore.Product.mass})
										</td>

										<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-white ">
											{purchase.quantity}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light  text-white">
											PHP {purchase.quantity * purchase.ProductStore.price}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default page
