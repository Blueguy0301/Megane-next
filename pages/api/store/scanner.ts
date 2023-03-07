import { NextApiRequest, NextApiResponse } from "next"
import { authority, nextFunction, product } from "@pages/types"
import prisma from "../db"
import { checkCredentials } from "@api/middleware"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	const { storeScan, productScan } = req.query
	const verb = req.method
	const credentials = await checkCredentials(req, res, authority.registered)
	if (!credentials) return
	if (verb === "GET" && storeScan) return getProductStore(req, res, credentials)
	if (verb === "GET" && productScan) return getProduct(req, res, credentials)
	else return res.status(405).end()
}
//* tested
//todo : add barcode
const getProductStore: nextFunction = async (req, res, user) => {
	const barcode = (req.query.barcode as string) ?? ""
	const getProductStore = await prisma.productStore
		.findFirst({
			where: {
				AND: [{ storeId: BigInt(user.storeId) }, { Product: { barcode: barcode } }],
			},
			select: {
				id: true,
				price: true,
				Product: {
					select: { name: true, mass: true },
				},
			},
		})
		.then((d) => ({
			name: d?.Product.name,
			mass: d?.Product.mass,
			price: d?.price,
			productStoreId: d?.id.toString(),
		}))
		.catch((e) => {
			console.log("error @ scanner.ts:37 \n", e)
			return { error: e }
		})
	if ("error" in getProductStore) return res.json(getProductStore)
	else return res.json({ result: getProductStore })
}

//* tested
//todo : add barcode

const getProduct: nextFunction = async (req, res, user) => {
	const { barcode } = req.query as product
	if (user.authorityId < authority.registered)
		return res.status(401).json({ error: "unauthorized" })
	if (!barcode) return res.json({ error: "no data found" })
	const getProduct = await prisma.product
		.findFirst({
			where: {
				barcode: barcode,
			},
			include: {
				ProductStore: {
					where: {
						storeId: BigInt(user.storeId),
					},
					select: {
						Location: true,
					},
				},
			},
		})
		.then((d) => ({
			newProduct: d?.id ? false : true,
			isStoreNew: d?.ProductStore[0]?.Location ? false : true,
			name: d?.name,
			barcode: d?.barcode,
			Category: d?.Category,
			mass: d?.mass,
			productId: d?.id.toString(),
		}))
		.catch((e) => ({
			error: e,
		}))
	if ("error" in getProduct) return res.json(getProduct)
	else return res.json({ result: getProduct })
}
