import prisma from "@api/db"
import Content from "./Content"
const getProducts = async () => {
	const res = await prisma.product
		.findMany({
			take: 50,
		})
		.then((datas) => datas.map((data) => ({ ...data, id: data.id.toString() })))
	return res
}
const page = async () => {
	const products = await getProducts()
	return (
		<div className="page relative flex-col gap-3 p-4">
			<Content data={products} />
		</div>
	)
}

export default page
