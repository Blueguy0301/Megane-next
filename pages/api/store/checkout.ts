//* successfully migrated to nextAuth added types
import { NextApiRequest, NextApiResponse } from "next"
import { checkOutBody, authority, Invoice, nextFunction } from "../../interface"
import prisma from "../db"
import { checkCredentials, testNumber } from "../middleware"

type query = {
	storeId: string
	invoiceId: string
}
export default async function handleCheckout(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const credentials = await checkCredentials(req, res)
	if (!credentials) return
	if (verb === "POST") return addCheckOut(req, res, credentials)
	if (verb === "GET") return getCheckOut(req, res, credentials)
	if (verb === "DELETE") return deleteCheckOut(req, res, credentials)
	else return res.status(405).end()
}
//todo : if productList is 0, return an error
//todo : add creditTotal
const addCheckOut: nextFunction = async (req, res, user) => {
	const { productList, isCredited, total, customerName, creditTotal } = req.body as checkOutBody
	let products: { productStoreId: bigint, quantity: number }[]
	if (testNumber(user.storeId) || testNumber(total) || testNumber(creditTotal))
		return res.json({ error: "invalid arguments" })
	if (Array.isArray(productList)) {
		if (productList.length <= 0) return res.json({ error: "no products listed" })
		products = productList.map((product) => ({
			productStoreId: BigInt(product.productStoreId),
			quantity: Number(product.quantity ?? 0)
		}))
	}
	else if (testNumber(productList?.productStoreId))
		return res.json({ error: "invalid arguments" })
	else products = [{
		productStoreId: BigInt(productList.productStoreId), quantity: Number(productList.quantity ?? 0)
	}]
	let data: Invoice = { storeId: BigInt(user.storeId), dateTime: new Date(), total }
	if (isCredited && customerName) {
		const count = await prisma.installments
			.updateMany({
				where: {
					customerName: customerName,
					storeId: BigInt(user.storeId),
				},
				data: {
					total: { increment: Number(creditTotal) },
				},
			})
			.catch((e) => {
				console.log("error at checkout.ts:49\n", e)
				return { error: e }
			})
		if ("error" in count) return
		if (count.count < 1) {
			const addInstallment = await prisma.installments
				.create({
					data: {
						total: Number(total),
						storeId: BigInt(user.storeId),
						customerName: customerName,
					},
					select: { id: true },
				})
				.then((d) => ({
					id: d.id.toString(),
				}))
				.catch((e) => {
					console.log("error @ checkout:67\n", e)
					return { error: e }
				})
			if ("error" in addInstallment) return res.json(addInstallment)
			if (addInstallment.id) data = { ...data, installmentId: BigInt(addInstallment.id) }
		} else {
			const installmentId = await prisma.installments
				.findFirst({
					where: {
						AND: [{ customerName: customerName }, { storeId: BigInt(user.storeId) }],
					},
					select: { id: true },
				})
				.then((d) => ({ id: d?.id.toString() }))
				.catch((e) => {
					console.log("error at checkout.ts:85\n", e)
					return { error: e }
				})
			if ("error" in installmentId) return res.json(installmentId)
			if (installmentId.id) data = { ...data, installmentId: BigInt(installmentId.id) }
		}
	}
	const invoice = await prisma.invoice
		.create({
			data: {
				...data,
				InvoicePurchases: {
					createMany: { data: products },
				},
			},
			select: {
				total: true,
				Installment: {
					select: { customerName: true, total: true },
				},
			},
		})
		.then((d) => ({
			success: true,
			customerName: d.Installment?.customerName ?? null,
			total: d.total,
			installmentTotal: d.Installment?.total ?? null,
		}))
		.catch((e) => {
			console.log("error @ checkout.ts:114 \n", e)
			return { error: e }
		})
	if ("error" in invoice) return res.json(invoice)
	else return res.json({ result: invoice })
}
const getCheckOut: nextFunction = async (req, res, user) => {
	const { invoiceId } = req.query as query

	if (user.authorityId < authority.registered)
		return res.status(401).json({ error: "invalid credentials" })

	if (testNumber(user.storeId) || testNumber(invoiceId))
		return res.json({ error: "invalid arguments" })
	const getCheckOut = await prisma.invoice
		.findFirst({
			where: { AND: [{ storeId: BigInt(user.storeId) }, { id: BigInt(invoiceId) }] },
			include: {
				InvoicePurchases: {
					include: {
						ProductStore: {
							select: {
								price: true,
								Product: {
									select: {
										name: true,
										mass: true,
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
				name: product.ProductStore.Product.name,
				mass: product.ProductStore.Product.mass,
				price: product.ProductStore.price,
			})),
			Installment: d?.Installment?.customerName ?? false,
			date: d?.dateTime,
		}))
		.catch((e) => e)
	return res.json({ result: getCheckOut })
}
const deleteCheckOut: nextFunction = async (req, res, user) => {
	if (user.authorityId < authority.storeOwner)
		return res.status(401).json({ error: "unauthorized" })
	const { invoiceId } = req.body as query
	if (testNumber(user.storeId) || testNumber(invoiceId))
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
