import { authOptions } from "@api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import prisma from "@api/db"

import { notFound } from "next/navigation"
import Table from "./Table"
async function getData(params: string) {
	const data = await prisma.installments
		.findFirst({
			where: {
				id: BigInt(params),
			},
			select: {
				Invoice: {
					select: {
						dateTime: true,
						total: true,
						id: true,
					},
					take: 50,
				},
				customerName: true,
				total: true,
			},
		})
		.then((d) => ({
			customerName: d?.customerName,
			total: d?.total,
			Invoice: d?.Invoice.map((i) => ({ ...i, id: i.id.toString() })),
		}))
	return data
}
const page = async ({ params }: { params: { id: string } }) => {
	const session = getServerSession(authOptions)
	const data = await getData(params.id)
	if (!session) return
	if (!data || !data.customerName || !data.total) return notFound()
	else
		return (
			<div className="page flex-col gap-3 p-4">
				<h3>Installment history </h3>
				<p>User : {data?.customerName}</p>
				<p>Total Unpaid : {data?.total}</p>
				<h3>Invoice History:</h3>
				<Table data={data.Invoice} />
			</div>
		)
}

export default page
