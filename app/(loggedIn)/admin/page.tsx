import Content from "./content"
import prisma from "@api/db"
import { getServerSession, Session } from "next-auth"
import { authOptions } from "@api/auth/[...nextauth]"
import { authority } from "@pages/types"
import { redirect } from "next/navigation"
async function getData() {
	const data = await prisma.stores
		.findMany({
			where: {},
			take: 50,
			orderBy: { name: "asc" },
			include: {
				_count: true,
			},
		})
		.then((d) => d.map((store) => ({ ...store, id: store.id.toString() })))
	return data
}
const page = async () => {
	const data = await getData()
	const user = (await getServerSession(authOptions)) as Session
	if (user.user.authorityId < authority.admin) return redirect("/store/dashboard")
	return (
		<div className="page flex-col gap-3 p-4">
			<h2>Admin</h2>
			<Content data={data} />
			{/* todo : add users and stores table here. */}
		</div>
	)
}

export default page
