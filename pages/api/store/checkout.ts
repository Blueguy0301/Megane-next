import { NextApiRequest, NextApiResponse } from "next"
import type { Invoice, InvoicePurchase, product, productStore } from "../../interface"
import prisma from "../db"
import { checkCredentials, testNumber } from "../middleware"
type body = {
	productList: Array<InvoicePurchase> | InvoicePurchase
	storeId: string
	isCredited?: boolean
}
type query = {
	storeId: string
	invoiceId: string
}
export default async function handleCheckout(req: NextApiRequest, res: NextApiResponse) {
	//* if statement for request method. only get, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	if (verb === "POST") return addCheckOut(req, res)
	if (verb === "DELETE") return deleteCheckOut(req, res)
	if (verb === "GET") return getCheckOut(req, res)
	else return res.status(405).end()
}

const addCheckOut = async (req: NextApiRequest, res: NextApiResponse) => {
	const { storeId, productList, isCredited } = req.body as body
	let products: { productStoreId: bigint }[]
	if (testNumber(storeId)) return res.json({ error: "invalid arguments" })
	if (Array.isArray(productList))
		products = productList.map((product) => ({
			productStoreId: BigInt(product.productStoreId),
		}))
	else if (testNumber(productList?.productStoreId as string))
		return res.json({ error: "invalid arguments" })
	else products = [{ productStoreId: BigInt(productList.productStoreId) }]
	let data: Invoice = { storeId: BigInt(storeId), dateTime: new Date() }
	if (isCredited) {
		const installmentId = (await prisma.installments
			.create({
				data: {
					customerName: "",
				},
			})
			.then((v) => v.id.toString())) as string
		data = { ...data, installmentId: BigInt(installmentId) }
	}
	const invoice = await prisma.invoice
		.create({
			data: {
				...data,
				InvoicePurchases: {
					createMany: {
						data: products,
					},
				},
			},
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
		}))
	return res.json(invoice)
}
const getCheckOut = async (req: NextApiRequest, res: NextApiResponse) => {
	const { storeId, invoiceId } = req.query as query
	if (testNumber(storeId) || testNumber(invoiceId))
		return res.json({ error: "invalid arguments" })
	const getCheckOut = await prisma.invoice
		.findFirst({
			where: { id: BigInt(invoiceId) },
			include: {
				InvoicePurchases: {
					include: {
						ProductStore: {
							select: {
								price: true,
								Product: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				},
				Installment: {
					select: {
						customerName: true,
					},
				},
			},
		})
		.then((d) => ({
			id: d?.id.toString(),
			products: d?.InvoicePurchases.map((product) => ({
				name: product.ProductStore.Product,
				price: product.ProductStore.price,
			})),
			Installment: d?.Installment?.customerName ?? false,
			date: d?.dateTime,
		}))
		.catch((e) => {
			return { error: e }
		})
	return res.json(getCheckOut)
}
const deleteCheckOut = async (req: NextApiRequest, res: NextApiResponse) => {
	const { storeId, invoiceId } = req.body as query
	if (testNumber(storeId) || testNumber(invoiceId))
		return res.json({ error: "invalid arguments" })
	const deleteCheckOut = await prisma.invoice
		.delete({
			where: {
				id: BigInt(invoiceId),
			},
		})
		.then(() => ({
			success: true,
		}))
		.catch((e) => ({ error: e, success: false }))
	return res.json(deleteCheckOut)
}
