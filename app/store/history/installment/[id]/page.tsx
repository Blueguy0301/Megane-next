import { authOptions } from "@api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import prisma from "@api/db"

import { notFound } from "next/navigation"
import Table from "./Table"
import Button from "@components/Button"
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
				<h2>Installment history </h2>
				<div className="flex flex-row items-start justify-center">
					<div className="">
						<p>User : {data?.customerName}</p>
						<p>Total Unpaid : PHP {data?.total}</p>
					</div>
					<Button type="button" className="green ml-auto">
						Update
					</Button>
				</div>
				<h3>Invoice History:</h3>
				<Table data={data.Invoice} />
			</div>
		)
}

export default page
