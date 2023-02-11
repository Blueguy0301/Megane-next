//* successfully migrated to nextAuth and added to response.type
import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials, checkIfValid, filter, testNumber } from "../middleware"
import {
	nextFunction,
	product,
	productQuery,
	productStore,
	authority,
} from "../../interface"
import prisma from "../db"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const credentials = await checkCredentials(req, res, authority.registered)
	const { isStoreNew, onlyStore, pId } = req.query as unknown as productQuery
	if (!credentials) return
	if (verb === "GET") return getProductStore(req, res, credentials)
	if (verb === "POST" && isStoreNew && pId)
		return addProductStore(req, res, credentials, pId)
	if (verb === "POST") return addProduct(req, res, credentials, isStoreNew)
	if (verb === "PUT" && onlyStore) return updateProductStore(req, res, credentials)
	if (verb === "PUT") return updateProduct(req, res, credentials)
	if (verb === "DELETE" && onlyStore) return deleteProductStore(req, res, credentials)
	if (verb === "DELETE") return deleteProduct(req, res, credentials)
	else return res.status(405).end()
}
//* test pass 2/2
const addProduct: nextFunction = async (req, res, user, isStoreNew = false) => {
	const { barcode, name, category, mass } = req.body as product
	if (user.authorityId < authority.storeOwner)
		return res.status(401).json({ error: "unauthorized" })
	if (!checkIfValid(barcode) && !isStoreNew)
		return res.json({ error: "an error occured" })
	const newProduct = await prisma.product
		.upsert({
			where: { barcode: barcode },
			create: {
				name: name,
				barcode: barcode,
				Category: category,
				mass: mass,
			},
			update: {},
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
		}))
		.catch((e) => {
			console.log("error @ product.ts:50 \n", e)
			if (e.code === "P2002")
				return { error: `${name} already exists in the database. try using other names` }
			else return e
		})
	if ("error" in newProduct) return res.json(newProduct)
	if (isStoreNew && newProduct.id) return addProductStore(req, res, user, newProduct.id)
	return res.json({ result: newProduct })
}
//* tested
const updateProduct: nextFunction = async (req, res, user) => {
	const { barcode, name, category, mass } = req.body as product
	if (user.authorityId < authority.admin)
		return res.status(401).json({ error: "unauthorized" })
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
		.catch((e) => ({ error: e }))
	if ("error" in updateProduct) return res.json(updateProduct)
	else return res.json({ result: updateProduct })
}
//! todo : no error handling
//* tested
const deleteProduct: nextFunction = async (req, res, user) => {
	const { pId } = req.body
	if (user.authorityId < authority.admin)
		return res.status(401).json({ error: "unauthorized" })
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

//* test pass 2/2
const addProductStore: nextFunction = async (req, res, user, productId: string) => {
	const { price, location, description } = req.body as productStore
	if (user.authorityId < authority.storeOwner)
		return res.status(401).json({ error: "unauthorized" })
	if (
		(!productId && !checkIfValid(price, location, description)) ||
		testNumber(productId) ||
		testNumber(user.storeId)
	)
		return res.json({ error: "an error occured" })
	const countProductStore = await prisma.productStore.count({
		where: { AND: [{ productId: BigInt(productId) }, { storeId: BigInt(user.storeId) }] },
	})
	if (countProductStore > 0)
		return res.json({ result: { error: "product already exists on your store" } })
	const createProductStore = await prisma.productStore
		.create({
			data: {
				productId: BigInt(productId),
				price: Number(price),
				Location: location,
				Description: description ?? "",
				storeId: BigInt(user.storeId),
			},
			select: {
				id: true,
				productId: false,
				storeId: false,
				price: true,
				Location: true,
				Description: true,
			},
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
			productId: productId,
		}))
		.catch((e) => {
			console.log("error in line 127 @ product.ts", e)
			if (e.code === "P2003") return { error: `${productId} is not a product` }
			else return e
		})
	if ("error" in createProductStore) return res.json(createProductStore)
	else return res.json({ result: createProductStore })
}
//* tested
const updateProductStore: nextFunction = async (req, res, user) => {
	const { pId, price, location, description } = req.body
	if (user.authorityId < authority.storeOwner)
		return res.status(401).json({ error: "unauthorized" })
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
		.catch((e) => ({ error: e }))
	if ("error" in updateProduct) {
		console.log(updateProduct)
		return res.json({ error: updateProduct })
	} else return res.json({ result: updateProduct })
}
//* tested
const deleteProductStore: nextFunction = async (req, res, user) => {
	const { pId } = req.body
	if (user.authorityId < authority.storeOwner)
		return res.status(401).json({ error: "unauthorized" })
	if (!pId || testNumber(pId)) return res.json({ error: "invalid arguments" })
	const Delete = await prisma.productStore
		.delete({ where: { id: BigInt(pId) } })
		.then(() => ({ success: true }))
		.catch((e) => ({ error: e?.meta?.cause, success: false }))
	return res.json({ result: Delete })
}
//! todo : no error handling
const getProductStore: nextFunction = async (req, res, user) => {
	const { id, barcode } = req.query as { [x: string]: string }
	if (user.authorityId < authority.registered)
		return res.status(401).json({ error: "unauthorized" })
	if (!id && !checkIfValid(user.storeId, barcode))
		return res.json({ error: "invalid arguments" })
	if (user.authorityId < authority.registered)
		return res.status(401).json({ error: "unauthorized" })
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
				if (!d || d?.ProductStore?.length === 0) return false
				else
					return {
						name: d?.name,
						barcode: d?.barcode,
						price: d.ProductStore[0].price,
						location: d?.ProductStore[0]?.Location,
						description: d?.ProductStore[0]?.Description,
						productStoreId: d?.ProductStore[0]?.id?.toString(),
						productId: d?.id?.toString(),
					}
			})
		return res.json(productId ? { result: productId } : { error: "Nothing found" })
	}
	if (id && !testNumber(id)) {
		const searchStore = await prisma.productStore
			.findFirst({
				where: { id: BigInt(id) },
				select: {
					id: true,
					storeId: false,
					price: true,
					Location: true,
					Description: true,
					Product: {
						select: {
							name: true,
							barcode: true,
						},
					},
					productId: true,
				},
			})
			.then((d) => ({
				...d?.Product,
				price: d?.price,
				location: d?.Location,
				description: d?.Description,
				productStoreId: d?.id.toString(),
				productId: d?.productId.toString(),
			}))
		return res.json(searchStore ? { result: searchStore } : { error: "Nothing found" })
	} else return res.json({ error: "invalid arguments" })
}
