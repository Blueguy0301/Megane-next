/* eslint-disable react-hooks/rules-of-hooks */
import { authOptions } from "@api/auth/[...nextauth]"
import Button from "@components/Button"
import prisma from "@api/db"
import { getServerSession } from "next-auth/next"
import { authority } from "@pages/types"
import Card from "./Card"
import CardInfo from "./CardInfo"
const getData = async (storeId: any) => {
	const storeInfo = await prisma.stores.findFirst({
		where: { id: BigInt(storeId) },
		select: {
			_count: {
				select: {
					productStore: true,
					users: true,
					Invoices: true,
				},
			},
			Invoices: {
				select: {
					total: true,
				},
			},

			name: true,
			Installments: {
				select: {
					total: true,
				},
			},
		},
	})

	return storeInfo
}
export default async function page() {
	const session = await getServerSession(authOptions)
	if (!session) return
	const data = await getData(session.user.storeId)
	if (!data) return
	const total = data.Invoices.map((t) => t.total).reduce((a, b) => a + b, 0)
	const Installments = data.Installments.map((t) => t.total).reduce((a, b) => a + b, 0)
	return (
		<div className="page flex-row flex-wrap items-center gap-10  p-10">
			<div className="flex w-full flex-row flex-wrap gap-10">
				<Card className="flex flex-col flex-wrap gap-10 p-3">
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<h2 className="w-full">Overview</h2>
						<CardInfo
							src="/sales.svg"
							alt="sales"
							title="Unpaid Credits"
							value={Installments}
						/>
						<CardInfo src="/profit.svg" alt="profit" title="profit" value={total} />
					</div>
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<CardInfo
							src="/sold.svg"
							alt="Total Invoices"
							title="Total Invoices"
							value={data._count.Invoices}
						/>
						<CardInfo src="/revenue.svg" alt="revenue" title="Revenue" value={total} />
					</div>
				</Card>
				<Card className="flex flex-col flex-wrap gap-10 p-3">
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<h2 className="w-full">About the Store</h2>
						<CardInfo
							className="side"
							src="/store.svg"
							alt=" store"
							title="Store Name"
							value={data.name}
						/>
						<CardInfo
							className="side"
							src="/user.svg"
							alt="users"
							title="Registered Users"
							value={data._count.users}
						/>
					</div>
					<CardInfo
						className="side"
						src="/products.svg"
						alt=""
						title="No. of Products"
						value={data._count.productStore}
					/>
					{session.user.authorityId >= authority.admin && (
						<Button type="Link" href="/admin">
							Admin Panel
						</Button>
					)}
				</Card>
			</div>
			<Card className="h-[450px] w-full">
				<h1>test</h1>
			</Card>
		</div>
	)
}
