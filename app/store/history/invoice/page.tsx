import Table from "./Table"
import prisma from "@api/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@api/auth/[...nextauth]"
import { redirect } from "next/navigation"
async function getData() {
	const data = await prisma.invoice
		.findMany({
			where: {},
			take: 50,
			select: {
				id: true,
				dateTime: true,
				total: true,
				Installment: {
					select: {
						customerName: true,
					},
				},
			},
		})
		.then((invoices) =>
			invoices.map((invoice) => ({
				total: invoice.total,
				Installment: invoice.Installment?.customerName ?? "Unknown",
				id: invoice.id.toString(),
				dateTime: invoice.dateTime.toISOString(),
			}))
		)
	return data
}
const page = async () => {
	const data = await getData()
	const session = await getServerSession(authOptions)
	if (!session) redirect("/login")
	return (
		<div className="page flex-col gap-3 p-4">
			<h3>Invoices</h3>
			<Table data={data} session={session} />
		</div>
	)
}

export default page
