import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials, checkIfValid, filter, testNumber } from "../middleware"
import type { product, productQuery, productStore } from "../../interface"
import prisma from "../db"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	const { isNew, isStoreNew, storeSearch, onlyStore, productId } =
		req.query as unknown as productQuery
	if (!credentials) return
	if (verb === "GET" && storeSearch) return getProductStore(req, res)
	if (verb === "GET") return getProduct(req, res)
	if (verb === "POST" && isNew) return addProduct(req, res, isStoreNew)
	if (verb === "POST" && isStoreNew && productId)
		return addProductStore(req, res, productId)
	if (verb === "PUT" && onlyStore) return updateProductStore(req, res)
	if (verb === "PUT") return updateProduct(req, res)
	if (verb === "DELETE" && onlyStore) return deleteProductStore(req, res)
	if (verb === "DELETE") return deleteProduct(req, res)
	else return res.status(405).end()
}
//* tested
const addProduct = async (
	req: NextApiRequest,
	res: NextApiResponse,
	isStoreNew = false
) => {
	const { barcode, name, category, mass } = req.body as product
	if (!checkIfValid(barcode, name, category, mass))
		return res.json({ error: "an error occured" })
	const exists = await prisma.product
		.findFirst({
			where: {
				barcode: barcode,
				name: name,
			},
			select: {
				id: true,
			},
		})
		.then((e) => ({ id: e?.id.toString() }))
	if (exists.id && !isStoreNew) return
	const addProduct = !exists.id
		? await prisma.product
				.create({
					data: {
						name: name,
						barcode: barcode,
						Category: category,
						mass: mass,
					},
				})
				.then((v) => ({ ...v, id: v.id.toString(), error: false }))
				.catch((e) => {
					console.log(e)
					if (e.code === "P2002") {
						return { error: true, context: "barcode or name already exists" }
					}
					return { error: true, ...e }
				})
		: { id: exists?.id, error: false }
	if (isStoreNew && !addProduct.error) return addProductStore(req, res, addProduct.id)
	return res.json({ result: addProduct })
}
//* tested
const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
	const { barcode, name, category, mass } = req.body as product
	if (!checkIfValid(barcode)) return res.json({ error: "an error occured" })
	const data = filter({ barcode, name, Category: category, mass })
	if (!data) return res.json({ error: "no data found" })
	const updateProduct = await prisma.product
		.update({ where: { barcode: barcode }, data })
		.then((d) => ({
			name: d.name,
			barcode: d.barcode,
			Category: d.Category,
			mass: d.mass,
		}))
	return res.json({ result: updateProduct })
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
//* test pass 1/2
const addProductStore = async (
	req: NextApiRequest,
	res: NextApiResponse,
	productId: string | number | undefined
) => {
	const { price, location, description, storeId } = req.body as productStore
	if (
		(!productId && !checkIfValid(price, location, description)) ||
		testNumber(productId as string) ||
		testNumber(storeId as unknown as string)
	)
		return res.json({ error: "an error occured" })
	const createProductStore = await prisma.productStore
		.create({
			data: {
				productId: BigInt(productId as string),
				price: Number(price),
				Location: location,
				Description: description ?? "",
				storeId: BigInt(storeId ?? 0),
			},
		})
		.then((d) => ({
			...d,
			productId: d.productId.toString(),
			storeId: d.storeId.toString(),
			id: d.id.toString(),
		}))
		.catch((e) => {
			return e
		})
	// error here.
	return res.json({ result: createProductStore })
}
//* tested
const updateProductStore = async (req: NextApiRequest, res: NextApiResponse) => {
	const { pId, price, location, description } = req.body
	if (!pId) return res.json({ error: "invalid arguments" })
	const data = filter({
		price: !testNumber(price) ? Number(price) : undefined,
		Location: location,
		Description: description,
	})
	if (!data) return res.json({ error: "no data found" })
	const updateProduct = await prisma.productStore
		.update({
			where: {
				id: BigInt(pId),
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
