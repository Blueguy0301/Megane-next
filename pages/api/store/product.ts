import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials, checkIfValid, filter, testNumber } from "../middleware"
import type { nextFunction, product, productQuery, productStore } from "../../interface"
import prisma from "../db"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	const { isNew, isStoreNew, storeSearch, onlyStore, pId } =
		req.query as unknown as productQuery
	if (!credentials) return
	if (verb === "GET" && storeSearch) return getProductStore(req, res, credentials)
	if (verb === "GET") return getProduct(req, res, credentials)
	if (verb === "POST" && isNew) return addProduct(req, res, credentials, isStoreNew)
	if (verb === "POST" && isStoreNew && pId)
		return addProductStore(req, res, credentials, pId)
	if (verb === "PUT" && onlyStore) return updateProductStore(req, res, credentials)
	if (verb === "PUT") return updateProduct(req, res, credentials)
	if (verb === "DELETE" && onlyStore) return deleteProductStore(req, res, credentials)
	if (verb === "DELETE") return deleteProduct(req, res, credentials)
	else return res.status(405).end()
}
//* tested
//todo :  you can use upsert here instead. to make it quicker
const addProduct: nextFunction = async (req, res, credentials, isStoreNew = false) => {
	const { barcode, name, category, mass } = req.body as product
	const { data: user } = credentials
	if (user.authorityId < 3) return res.status(401).end()
	if (!checkIfValid(barcode, name, category, mass))
		return res.json({ error: "an error occured" })
	// check if the product already exists
	const existingProduct = await prisma.product.findFirst({
		where: { OR: [{ barcode: barcode }, { name: name }] },
	})
	if (existingProduct) return res.json({ result: "product or barcode already exists" })
	const newProduct = await prisma.product
		.create({
			data: {
				name: name,
				barcode: barcode,
				Category: category,
				mass: mass,
			},
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
		}))
	return res.json({ result: newProduct })
}
//* tested
const updateProduct: nextFunction = async (req, res, credentials) => {
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
//* tested
const deleteProduct: nextFunction = async (req, res, credentials) => {
	const { pId } = req.body
	if (!pId || testNumber(pId)) return res.json({ error: "no data found" })
	const deleteProduct = await prisma.product
		.delete({
			where: {
				id: BigInt(pId),
			},
		})
		.then(() => ({
			success: true,
		}))
		.catch((e) => ({ error: e, success: false }))
	return res.json(deleteProduct)
}
//todo : if not found in db, return {new: true}
const getProduct: nextFunction = async (req, res, credentials) => {
	const { barcode } = req.query as product
	if (!barcode) return res.json({ error: "no data found" })
	const getProduct = await prisma.product
		.findFirst({
			where: {
				barcode: barcode,
			},
		})
		.then((d) => ({
			id: d?.id.toString(),
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
//* test pass 2/2
const addProductStore: nextFunction = async (
	req,
	res,
	credentials,
	productId: string | number | undefined
) => {
	const { price, location, description } = req.body as productStore
	const { data: user } = credentials
	if (
		(!productId && !checkIfValid(price, location, description)) ||
		testNumber(productId as string) ||
		testNumber(user.storeId)
	)
		return res.json({ error: "an error occured" })
	const createProductStore = await prisma.productStore
		.create({
			data: {
				productId: BigInt(productId as string),
				price: Number(price),
				Location: location,
				Description: description ?? "",
				storeId: BigInt(user.storeId),
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
const updateProductStore: nextFunction = async (req, res, credentials) => {
	const { pId, price, location, description } = req.body
	const { data: user } = credentials
	if (user.authorityId < 3) return res.status(401).end()
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
//* tested
const deleteProductStore: nextFunction = async (req, res, credentials) => {
	const { pId } = req.body
	const { data: user } = credentials
	if (user.authorityId < 3) return res.status(401).end()
	if (!pId || testNumber(pId)) return res.json({ error: "invalid arguments" })
	const Delete = await prisma.productStore
		.delete({ where: { id: BigInt(pId) } })
		.then(() => ({ success: true }))
		.catch((e) => ({ error: e?.meta?.cause, success: false }))
	return res.json({ result: Delete })
}

const getProductStore: nextFunction = async (req, res, credentials) => {
	const { id } = req.query
	const { data: user } = credentials
	const { barcode } = req.query as { [x: string]: string }
	if (!id && !checkIfValid(user.storeId, barcode))
		return res.json({ error: "invalid arguments" })
	if (barcode && user.storeId && !id) {
		// todo  : add id of product here
		const productId = await prisma.product
			.findFirst({
				where: { barcode: barcode },
				select: {
					id: true,
					name: true,
					barcode: true,
					ProductStore: {
						where: {
							storeId: BigInt(user.storeId),
						},
						select: {
							id: true,
							price: true,
							Location: true,
							Description: true,
						},
					},
				},
			})
			.then((d) => {
				if (!d || d?.ProductStore?.length === 0) return "nothing found"
				else
					return {
						...d,
						ProductStore: {
							...d?.ProductStore[0],
							id: d?.ProductStore[0]?.id?.toString(),
						},
						id: d?.id?.toString(),
					}
			})
		return res.json({ result: productId })
	}
	if (id && !testNumber(id)) {
		const searchStore = await prisma.productStore
			.findFirst({
				where: { id: BigInt(user.storeId) },
				include: {
					Product: {
						select: {
							barcode: true,
							name: true,
						},
					},
				},
			})
			.then((d) => ({
				...d,
				id: d?.id.toString(),
				productId: d?.productId.toString(),
				...d?.Product,
			}))
		return res.json({ result: searchStore })
	} else return res.json({ error: "invalid arguments" })
}
