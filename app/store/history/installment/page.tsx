//* table migrated
import UserInfo from "./UserInfo"
import prisma from "@api/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@api/auth/[...nextauth]"
import { redirect } from "next/navigation"
async function getData() {
	const data = await prisma.installments
		.findMany({
			where: {},
			take: 50,
			select: {
				id: true,
				total: true,
				customerName: true,
				Invoice: {
					select: {
						_count: true,
					},
				},
			},
		})
		.then((invoices) =>
			invoices.map((invoice) => ({
				total: invoice.total,
				customerName: invoice.customerName,
				InvoiceCount: invoice.Invoice[0]?._count.InvoicePurchases ?? 0,
				id: invoice.id.toString(),
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
			<h3>Installments</h3>
			<UserInfo data={data} session={session} />
		</div>
	)
}

export default page
