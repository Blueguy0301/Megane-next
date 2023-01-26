//* checked  but getProduct is still in progress
import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials, checkIfValid, filter, testNumber } from "../middleware"
import type { product, productStore, userData } from "../../interface"
import prisma from "../db"
type query = {
	isNew?: boolean
	isStoreNew?: boolean
	storeSearch?: boolean
	onlyStore?: boolean
	productId?: number | string
}
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	//* if statement for request method. only update, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	const { isNew, isStoreNew, storeSearch, onlyStore, productId } =
		req.query as unknown as query
	if (!credentials) return
	if (verb === "GET" && storeSearch) return getProductStore(req, res)
	if (verb === "GET") return getProduct(req, res)
	if (verb === "POST" && isNew) return addProduct(req, res, isStoreNew)
	if (verb === "POST" && isStoreNew) return addProductStore(req, res, productId)
	if (verb === "PUT" && onlyStore) return updateProductStore(req, res)
	if (verb === "PUT") return updateProduct(req, res)
	if (verb === "DELETE" && onlyStore) return deleteProductStore(req, res)
	if (verb === "DELETE") return deleteProduct(req, res)
	else return res.status(405).end()
}
const addProduct = async (
	req: NextApiRequest,
	res: NextApiResponse,
	isStoreNew = false
) => {
	const { barcode, name, category, mass } = req.body as product
	if (!checkIfValid(barcode, name, category, mass))
		return res.json({ error: "an error occured" })
	const exists = await prisma.product.count({
		where: {
			barcode: barcode,
			name: name,
		},
	})
	if (exists && !isStoreNew) return
	const addProduct = await prisma.product
		.create({
			data: {
				name: name,
				barcode: barcode,
				Category: category,
				mass: mass,
			},
		})
		.then((v) => ({ ...v, id: v.id.toString() }))
	if (isStoreNew) return addProductStore(req, res, addProduct.id)

	return { result: addProduct }
}
const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
	const { barcode, name, category, mass } = req.body as product
	if (!checkIfValid(barcode, name, category, mass))
		return res.json({ error: "an error occured" })
	const updateProduct = await prisma.product
		.update({
			where: {
				barcode: barcode,
			},
			data: {
				name: name,
				barcode: barcode,
				Category: category,
				mass: mass,
			},
		})
		.then((d) => ({
			name: d.name,
			barcode: d.barcode,
			Category: d.Category,
			mass: d.mass,
		}))
}
const deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
	const { productId } = req.body
	if (!productId) return res.json({ error: "no data found" })
	const deleteProduct = await prisma.product
		.delete({
			where: {
				id: productId,
			},
		})
		.then(() => ({
			success: true,
		}))
		.catch((e) => ({ error: e, success: false }))
	return res.json(deleteProduct)
}
//todo : if not found in db, return {new: true}
const getProduct = async (req: NextApiRequest, res: NextApiResponse) => {
	const { barcode } = req.body as product
	if (!barcode) return res.json({ error: "no data found" })
	const getProduct = await prisma.product
		.findFirst({
			where: {
				barcode: barcode,
			},
		})
		.then((d) => ({
			name: d?.name,
			barcode: d?.barcode,
			Category: d?.Category,
			mass: d?.mass,
		}))
		.catch((e) => ({
			error: e,
		}))
	return res.json(getProduct)
}

const addProductStore = async (
	req: NextApiRequest,
	res: NextApiResponse,
	productId: string | number | undefined
) => {
	const tempData = req.body
	if ((!productId && !tempData) || testNumber(productId as string))
		return res.json({ error: "an error occured" })
	const createProductStore = await prisma.productStore
		.create({
			data: {
				productId: BigInt(productId as string),
				price: Number(tempData.price),
				Location: "",
				Description: "",
				storeId: BigInt(0),
			},
		})
		.then((d) => ({
			...d,
			productId: d.productId.toString(),
			storeId: d.storeId.toString(),
		}))
		.catch((e) => e)
	return res.json({ result: createProductStore })
}
const updateProductStore = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id, price, location, description } = req.body
	const data = filter({ price, location, description })
	if (!data) return res.json({ error: "no data found" })
	if (!id) return res.json({ error: "no data found" })
	const updateProduct = await prisma.productStore
		.update({
			where: {
				id: id,
			},
			data: {
				...data,
			},
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
			storeId: d.storeId.toString(),
			productId: d.productId.toString(),
		}))
		.catch((e) => e)
	return res.json({ result: updateProduct })
}
const deleteProductStore = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.body
	if (!id || !testNumber(id)) return res.json({ error: "invalid arguments" })
	const Delete = prisma.productStore
		.delete({
			where: {
				id: BigInt(id),
			},
		})
		.then((d) => ({ success: d ? true : false }))
		.catch((e) => e)
	return res.json({ result: Delete })
}
const getProductStore = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.body
	const { storeId, barcode } = req.body
	if (!id && !checkIfValid(storeId, barcode))
		return res.json({ error: "invalid arguments" })
	if (barcode && storeId && !id) {
		const productId = await prisma.product
			.findFirst({
				where: { barcode: barcode },
				select: { id: true },
			})
			.then((d) => ({ id: d?.id.toString() ?? "" }))
		const searchStore = await prisma.productStore
			.findFirst({
				where: {
					AND: [{ storeId: storeId }, { productId: BigInt(productId.id) }],
				},
			})
			.then((d) => ({ ...d, id: d?.id.toString(), productId: d?.productId.toString() }))
		return res.json({ result: searchStore })
	}
	if (id) {
		const searchStore = await prisma.productStore
			.findFirst({ where: { id: id } })
			.then((d) => ({ ...d, id: d?.id.toString(), productId: d?.productId.toString() }))
		return res.json({ result: searchStore })
	} else return res.json({ error: "invalid arguments" })
}
