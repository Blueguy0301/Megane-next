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
	return (
		<div className="page flex-col gap-3 p-4">
			<h3>Purchase History</h3>
			<p>Buyer : {data?.Installment?.customerName ?? "Unknown"}</p>
			<p>Total : {data?.total}</p>
			<p>Date Purchased : {convertDate(data?.dateTime as string)} </p>
			{data.InvoicePurchases.map((purchase, i) => {
				return (
					<p key={i}>
						{purchase.quantity}x {purchase.ProductStore.Product.name}(
						{purchase.ProductStore.Product.mass}) PHP{" "}
						{purchase.quantity * purchase.ProductStore.price}
					</p>
				)
			})}
		</div>
	)
}

export default page
