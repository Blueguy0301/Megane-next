"use client"
import Card from "./Card"
import CardInfo from "./CardInfo"
export default function page() {
	return (
		<div className="page flex-row flex-wrap items-center gap-10  p-10">
			<div className="flex w-full flex-row flex-wrap gap-10">
				<Card className="flex flex-col flex-wrap gap-10 p-3">
					<h2>Overview</h2>
					<div className="flex flex-row flex-wrap justify-center gap-10">
						<CardInfo src="/sales.svg" alt="sales" title="Total sales" value="9999999" />
						<CardInfo src="/profit.svg" alt="profit" title="profit" value="9999999" />
					</div>
					<div className="flex flex-row flex-wrap justify-center gap-10">
						<CardInfo src="/revenue.svg" alt="revenue" title="Revenue" value="9999999" />
						<CardInfo src="/sold.svg" alt="most sold" title="most sold" value="9999999" />
					</div>
				</Card>
				<Card className="flex flex-col flex-wrap gap-10 p-3">
					<div className="flex flex-row flex-wrap justify-start gap-10">
						<h2 className="w-full">About Store</h2>
						<CardInfo
							className="side"
							src="/store.svg"
							alt=" store"
							title="Store Name"
							value="9999999"
						/>
						<CardInfo
							className="side"
							src="/user.svg"
							alt="users"
							title="Registered Users"
							value="9999999"
						/>
					</div>
					<CardInfo
						className="side"
						src="/products.svg"
						alt=""
						title="No. of Products"
						value="900"
					/>
				</Card>
			</div>
			<Card className="h-[450px] w-full">
				<h1>test</h1>
			</Card>
		</div>
	)
}
