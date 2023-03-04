/* eslint-disable react-hooks/rules-of-hooks */
import { authOptions } from "@api/auth/[...nextauth]"
import Button from "@components/Button"
import prisma from "@api/db"
import { getServerSession } from "next-auth/next"
import { authority } from "@pages/types"
import Card from "./Card"
import CardInfo from "./CardInfo"
import { notFound } from "next/navigation"
const getData = async (storeId: any) => {
	const date = new Date()
	const storeInfo = await prisma.stores.findFirst({
		where: { id: BigInt(storeId) },
		select: {
			name: true,
			_count: {
				select: {
					productStore: true,
					users: true,
				},
			},
			Invoices: {
				where: {
					dateTime: {
						gte: new Date(date.setHours(0, 0, 0, 0)).toISOString(), // set start time of today
						lt: new Date(date.setHours(23, 59, 59, 999)).toISOString(), // set end time of today
					},
				},
				select: {
					total: true,
				},
			},
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
	if (!session || !session.user.storeId) return notFound()
	const data = await getData(session.user.storeId)
	if (!data) return new Error("No data found")
	const total = data.Invoices.reduce((a, b) => a + b.total, 0)
	const Installments = data.Installments.reduce((a, b) => a + b.total, 0)
	return (
		<div className="page dashboard flex-row flex-wrap items-center gap-10  p-10">
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
						<CardInfo src="/profit.svg" alt="profit" title="Profit" value={total} />
					</div>
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<CardInfo
							src="/sold.svg"
							alt="Invoices"
							title="Invoices"
							value={data.Invoices.length}
						/>
						<CardInfo
							src="/revenue.svg"
							alt="revenue"
							title="Revenue"
							value={total + Installments}
						/>
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
						alt="products"
						title="No. of Products"
						value={data._count.productStore}
					/>
					{session.user.authorityId >= authority.admin && (
						<Button type="Link" href="/admin" className="text-center">
							Admin Panel
						</Button>
					)}
				</Card>
				<Card className="flex flex-wrap gap-4 p-3">
					<h2 className="w-full">History</h2>
					<div className="flex w-full flex-wrap items-center justify-evenly gap-4">
						<Button
							type="Link"
							href="/store/history/invoice"
							className="flex-grow text-center md:flex-grow-0"
						>
							Invoice History
						</Button>
						<Button
							type="Link"
							href="/store/history/installment"
							className="flex-grow text-center md:flex-grow-0"
						>
							Credit List
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}
