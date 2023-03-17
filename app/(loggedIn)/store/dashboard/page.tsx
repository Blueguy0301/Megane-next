/* eslint-disable react-hooks/rules-of-hooks */
import { authOptions } from "@api/auth/[...nextauth]"
import Button from "@components/Button"
import prisma from "@api/db"
import { getServerSession } from "next-auth/next"
import { authority } from "@pages/types"
import Card from "./Card"
import CardInfo from "./CardInfo"
import { notFound } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faBagShopping,
	faCartShopping,
	faChartLine,
	faCoins,
	faPesoSign,
	faStore,
	faUser,
} from "@fortawesome/free-solid-svg-icons"
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
							icon={<FontAwesomeIcon icon={faPesoSign} size="2x" inverse />}
							title="Profit"
							value={total}
						/>
						<CardInfo
							icon={<FontAwesomeIcon icon={faCoins} size="2x" inverse />}
							alt="sales"
							title="Credits"
							value={Installments}
						/>
					</div>
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<CardInfo
							icon={<FontAwesomeIcon icon={faChartLine} size="2x" inverse />}
							title="Revenue"
							value={total + Installments}
						/>
						<CardInfo
							title="Invoices"
							value={data.Invoices.length}
							icon={<FontAwesomeIcon icon={faCartShopping} size="2x" inverse />}
						/>
					</div>
					<div className="flex flex-row flex-wrap gap-5">
						<Button
							type="Link"
							href="/store/history/invoice"
							className="flex-grow text-center "
						>
							Invoice History
						</Button>
						<Button
							type="Link"
							href="/store/history/installment"
							className="flex-grow text-center "
						>
							Credit List
						</Button>
					</div>
				</Card>
				<Card className="flex flex-col flex-wrap gap-10 p-3">
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<h2 className="w-full">About the Store</h2>
						<CardInfo
							icon={<FontAwesomeIcon icon={faStore} size="2x" inverse />}
							title="Store Name"
							value={data.name}
						/>

						<CardInfo
							icon={<FontAwesomeIcon icon={faUser} size="2x" inverse />}
							title="Current User"
							value={session.user.userName}
						/>
					</div>
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<CardInfo
							icon={<FontAwesomeIcon icon={faBagShopping} size="2x" inverse />}
							title="Total Products"
							value={data._count.productStore}
							className="ml-2"
						/>
						<CardInfo
							icon={<FontAwesomeIcon icon={faUser} size="2x" inverse />}
							title="Total Users"
							value={data._count.users}
							className="ml-4"
						/>
					</div>
					{session.user.authorityId >= authority.admin && (
						<Button type="Link" href="/admin" className="text-center">
							Admin Panel
						</Button>
					)}
				</Card>
			</div>
		</div>
	)
}
