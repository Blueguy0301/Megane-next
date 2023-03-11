//* Table Migrated
import UserInfo from "./UserInfo"
import { authOptions } from "@api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import type { Session } from "next-auth"
import prisma from "@api/db"
export default async function page() {
	const session = (await getServerSession(authOptions)) as Session
	const tableData = await getProductStore(session.user.storeId)
	return (
		<div className="page flex-col gap-3 p-4 ">
			<UserInfo data={tableData} session={session} />
		</div>
	)
}
async function getProductStore(storeId: string) {
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
