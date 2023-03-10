//* Table Migrated
import UserInfo from "./UserInfo"
import prisma from "@api/db"
import { getServerSession, Session } from "next-auth"
import { authOptions } from "@api/auth/[...nextauth]"
import { redirect } from "next/navigation"
async function getData(storeId: string) {
	const data = await prisma.invoice
		.findMany({
			where: {
				storeId: BigInt(storeId),
			},
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
				installmentId: true,
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
	const session = (await getServerSession(authOptions)) as Session
	const data = await getData(session?.user.storeId)
	return (
		<div className="page flex-col gap-3 p-4">
			<h3>Invoices</h3>
			<UserInfo data={data} session={session} />
		</div>
	)
}

export default page
