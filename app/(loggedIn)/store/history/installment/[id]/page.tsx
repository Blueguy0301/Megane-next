import prisma from "@api/db"
import { notFound } from "next/navigation"
import Purchases from "./Purchases"
import UserInfo from "./UserInfo"
import { numberRegex } from "@pages/types"
export const dynamic = "force-dynamic"
async function getData(params: string) {
	if (!numberRegex.test(params)) return
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
			Invoice: d?.Invoice.map((i) => ({
				...i,
				id: i.id.toString(),
				dateTime: i.dateTime.toISOString(),
			})),
		}))
	return data
}
const page = async ({ params }: { params: { id: string } }) => {
	const data = await getData(params.id)
	if (!data || !data.customerName) return notFound()
	else
		return (
			<div className="page flex-col gap-3 p-4">
				<UserInfo data={data} id={params.id} />
				<Purchases data={data.Invoice} />
			</div>
		)
}

export default page
