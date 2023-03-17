import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials, checkIfValid, filter, testNumber } from "../middleware"
import {
	nextFunction,
	product,
	productQuery,
	productStore,
	authority,
} from "@pages/types"
import prisma from "../db"
import { maxPageNumber } from "@app/types"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const credentials = await checkCredentials(req, res, authority.registered)
	const { isStoreNew, onlyStore, pId, adminOnly } = req.query as unknown as productQuery
	if (!credentials) return
	// temp. fix this. todo.
	if (verb === "GET" && adminOnly) return getProductPage(req, res, credentials)
	if (verb === "GET") return getProductStorePage(req, res, credentials)
	if (verb === "POST" && isStoreNew && pId)
		return addProductStore(req, res, credentials, pId)
	if (verb === "POST") return addProduct(req, res, credentials, isStoreNew)
	if (verb === "PUT" && onlyStore) return updateProductStore(req, res, credentials)
	if (verb === "PUT") return updateProduct(req, res, credentials)
	if (verb === "PATCH" && onlyStore) return deleteProductStore(req, res, credentials)
	if (verb === "PATCH") return deleteProduct(req, res, credentials)
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
				Category: category ?? "Others",
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
	const { barcode, name, category, mass, newBarcode } = req.body as product
	if (user.authorityId < authority.admin)
		return res.status(401).json({ error: "unauthorized" })
	if (!checkIfValid(barcode)) return res.json({ error: "an error occured" })
	const data = filter({ barcode: newBarcode, name, Category: category, mass })
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
//* tested
const deleteProduct: nextFunction = async (req, res, user) => {
	const { pId } = req.body
	let data
	if (Array.isArray(pId)) data = pId.map(id => BigInt(id))
	else data = [BigInt(pId)]
	if (user.authorityId < authority.admin)
		return res.status(401).json({ error: "unauthorized" })
	if (!pId || testNumber(pId)) return res.json({ error: "no data found" })
	const deleteProduct = await prisma.product
		.deleteMany({ where: { id: { in: data }, }, })
		.then(() => ({ success: true }))
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
		return res.json({ error: "product already exists on your store" })
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
			if (e.code === "P2003") return { error: `${productId} is not a product.` }
			else return { error: "an error has occured while saving." }
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
			price: d.price,
			Location: d.Location,
			Description: d.Description,
			productStoreId: d.id.toString(),
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
	const { pId }: { pId: any[] | string } = req.body
	let data
	if (!pId) return res.json({ error: "invalid arguments" })
	if (user.authorityId < authority.storeOwner)
		return res.status(401).json({ error: "unauthorized" })
	if (Array.isArray(pId)) data = pId.map(id => BigInt(id))
	else if (testNumber(pId)) data = [BigInt(pId)]
	const Delete = await prisma.productStore
		.deleteMany({ where: { id: { in: data } } })
		.then(() => ({ success: true }))
		.catch((e) => {
			console.log('error @ product.tss:188', e)
			return { error: e?.meta?.cause, success: false }
		})
	return res.json(Delete)
}
const getProductStorePage: nextFunction = async (req, res, user) => {
	const { page } = req.query as { [x: string]: string }
	if (!page) return res.json({ error: "Invalid Parameters" })
	const products = await prisma.productStore
		.findMany({
			where: { storeId: BigInt(user.storeId) },
			select: {
				Product: {
					select: {
						name: true,
						mass: true,
						barcode: true,
					},
				},
				Location: true,
				price: true,
				id: true,
			},
			take: maxPageNumber,
			skip: Number(page) * maxPageNumber
		})
		.then((data) => data.map((d) => ({ ...d, id: d.id.toString() }))).catch(e => ({ error: e }))
	if ("error" in products) return res.json(products)
	else return res.json(products ? { result: products } : { error: "Nothing found" })

}

const getProductPage: nextFunction = async (req, res, user) => {
	const { page } = req.query as { [x: string]: string }
	if (!page) return res.json({ error: "Invalid parameters" })
	if (user.authorityId < authority.admin)
		return res.status(401).json({ error: "unauthorized" })
	const products = await prisma.product
		.findMany({

			skip: Number(page) * maxPageNumber,
			take: maxPageNumber,
		})
		.then((data) => data.map((d) => ({ ...d, id: d.id.toString() }))).catch(e => ({ error: e }))
	if ('error' in products) return res.json(products)
	else return res.json(products ? { result: products } : { error: "Nothing found" })
}