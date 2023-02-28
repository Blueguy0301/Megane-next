import { NextApiRequest, NextApiResponse } from "next"
import { nextFunction } from "../../interface"
import { checkCredentials, checkIfValid, testNumber } from "../middleware"
import { installments } from "../../interface"
import prisma from "../db"
type installment = {
	id: string[] | string
}
const select = {
	id: true,
	customerName: true,
	total: true,
}
export default async function handleInstallments(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const verb = req.method
	const credentials = await checkCredentials(req, res)
	if (!credentials) return
	if (verb === "GET") return getInstallment(req, res, credentials)
	if (verb === "POST") return addInstallment(req, res, credentials)
	if (verb === "PUT") return updateInstallment(req, res, credentials)
	if (verb === "PATCH") return deleteInstallment(req, res, credentials)
	else return res.status(405).end()
}
//* tested
const addInstallment: nextFunction = async (req, res, user) => {
	let { customerName, total, isAdded } = req.body as installments
	const { storeId } = user
	if (!checkIfValid(customerName) || testNumber(total) || testNumber(storeId))
		return res.json({ error: "invalid arguments" })
	total = isAdded ? total : -total
	const checkDuplicates = await prisma.installments
		.findFirst({
			where: {
				AND: [{ storeId: BigInt(storeId) }, { customerName: customerName }],
			},
			select: { id: true },
		})
		.then((d) => d?.id.toString())
	if (checkDuplicates) return updateInstallment(req, res, user, checkDuplicates)
	const addInstallment = await prisma.installments
		.create({
			data: {
				total: Number(total),
				storeId: BigInt(storeId),
				customerName: customerName,
			},
			select,
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
		}))
		.catch((e) => {
			console.log("error @ installment:55\n", e)
			return { error: e }
		})
	if ("error" in addInstallment) return res.json(addInstallment)
	return res.json({ result: addInstallment })
}
//* tested
const deleteInstallment: nextFunction = async (req, res, user) => {

	const installments: installment = req.body
	let id
	console.log(installments);
	if (!checkIfValid(installments)) return res.json({ error: "invalid arguments" })
	if (Array.isArray(installments.id)) {
		id = installments.id.map(installment => BigInt(installment))
	}
	else id = [BigInt(installments.id)]
	const addInstallment = await prisma.installments
		.deleteMany({ where: { id: { in: id } } })
		.then(() => ({ success: true }))
		.catch((e) => {
			console.log("error @ installment.ts:65\n", e)
			return { error: e?.meta?.cause, success: false }
		})
	return res.json(addInstallment)
}
//* not used
const getInstallment: nextFunction = async (req, res) => {
	const { id } = req.query as unknown as installments
	if (testNumber(id)) return res.json({ error: "invalid arguments" })
	const getInstallment = await prisma.installments
		.findFirst({
			where: { id: BigInt(id) },
			select,
		})
		.then((d) => ({ ...d, id: d?.id.toString() }))
		.catch((e) => {
			console.log("error in installment.ts:78 \n", e)
			return { error: e }
		})
	if ("error" in getInstallment) return res.json(getInstallment)
	else return res.json({ result: getInstallment })
}
//* tested
const updateInstallment: nextFunction = async (req, res, user, installmentId) => {
	console.log(req.body)
	let { total, isAdded, id } = req.body as installments
	if (testNumber(total)) return res.json({ error: "invalid arguments" })
	total = isAdded ? total : -total
	id = id ?? installmentId
	const updateInstallment = await prisma.installments
		.update({
			where: { id: BigInt(id) },
			data: { total: { increment: Number(total) } },
			select,
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
		}))
		.catch((e) => {
			console.log("error in installment.ts:118 \n", e)
			return { error: e }
		})
	if ("error" in updateInstallment) return res.json(updateInstallment)
	return res.json({ result: updateInstallment })
}
