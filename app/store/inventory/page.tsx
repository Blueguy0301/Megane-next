/* eslint-disable react-hooks/rules-of-hooks */
import Table from "./Table"
import { authOptions } from "@api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import prisma from "@api/db"
export default async function page() {
	const session = await getServerSession(authOptions)
	if (!session) redirect("/login")

	const tableData = await getProductStore(session.user.storeId)
	return (
		<div className="page flex-col gap-3 p-4 ">
			<Table data={tableData} session={session} />
		</div>
	)
}
async function getProductStore(storeId: number) {
	const products = await prisma.productStore
		.findMany({
			where: { storeId: BigInt(storeId) },
			select: {
				Product: {
					select: {
						name: true,
						mass: true,
						barcode: true,
					},
				},
				Location: true,
				price: true,
				id: true,
			},
			take: 50,
		})
		.then((data) => data.map((d) => ({ ...d, id: d.id.toString() })))
	return products
}
