import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials, checkIfValid, filter, testNumber } from "../middleware"
import { authority, nextFunction, productQuery } from "../../interface"
import prisma from "../db"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	if (credentials.data.authorityId < authority.registered)
		return res.status(401).json({ error: "unauthorized" })
	if (verb === "GET") return getProductStore(req, res, credentials)
	else return res.status(405).end()
}
const getProductStore: nextFunction = async (req, res, credentials) => {
	const { storeId } = credentials.data
	const barcode = (req.query.barcode as string) ?? ""
	const getProductStore = await prisma.productStore
		.findFirst({
			where: {
				AND: [
					{ storeId: storeId },
					{
						Product: {
							barcode: barcode,
						},
					},
				],
			},
			select: {
				id: true,
				price: true,
				Product: {
					select: {
						name: true,
						Category: true,
						mass: true,
					},
				},
			},
		})
		.then((d) => ({
			id: d?.id.toString(),
			name: d?.Product.name,
			Category: d?.Product.Category,
			mass: d?.Product.mass,
			price: d?.price,
		}))
		.catch((e) => e)
	return res.json({ result: getProductStore })
}
