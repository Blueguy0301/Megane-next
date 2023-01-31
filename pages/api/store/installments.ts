import { NextApiRequest, NextApiResponse } from "next"
import { nextFunction } from "../../interface"
import { checkCredentials, checkIfValid, testNumber } from "../middleware"
import { installments } from "../../interface"
import prisma from "../db"
export default async function handleInstallments(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//* if statement for request method. only get, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	if (verb === "GET") return getInstallment(req, res, credentials)
	if (verb === "POST" || verb === "PUT") return addInstallment(req, res, credentials)
	if (verb === "DELETE") return deleteInstallment(req, res, credentials)
	else return res.status(405).end()
}
const addInstallment: nextFunction = async (req, res, credentials) => {
	const { id, customerName, total, isAdded } = req.body as installments
	if (testNumber(id) || !checkIfValid(customerName) || testNumber(total))
		return res.json({ error: "invalid arguments" })
	const addInstallment = await prisma.installments
		.upsert({
			where: { customerName: customerName },
			update: {
				total: {
					increment: isAdded ? total : -total,
				},
			},
			create: {
				customerName: customerName,
				total: total,
			},
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
		}))
	return res.json({ result: addInstallment })
}

const deleteInstallment: nextFunction = async (req, res, credentials) => {
	const { id, customerName, total, isAdded } = req.body as installments
	if (testNumber(id) || !checkIfValid(customerName) || testNumber(total))
		return res.json({ error: "invalid arguments" })
	const addInstallment = prisma.installments
		.delete({
			where: { customerName: customerName, id: BigInt(id) },
		})
		.then((d) => ({
			...d,
			id: d.id.toString(),
		}))
	return res.json({ result: addInstallment })
}
//on invoice, only select id and total for that user. or the total itself
const getInstallment: nextFunction = async (
	req: NextApiRequest,
	res: NextApiResponse<any>
) => {
	const { id } = req.body as installments
	if (testNumber(id)) return res.json({ error: "invalid arguments" })
	const getInstallment = await prisma.installments
		.findFirst({
			where: { id: BigInt(id) },
		})
		.then((d) => ({ ...d, id: d?.id.toString() }))
	return res.json({ result: getInstallment })
}
