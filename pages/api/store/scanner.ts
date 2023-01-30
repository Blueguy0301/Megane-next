import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials, checkIfValid, filter, testNumber } from "../middleware"
import type { nextFunction, productQuery } from "../../interface"
import prisma from "../db"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)

	if (!credentials) return
	if (verb === "GET") return getProductStore(req, res, credentials)
	else return res.status(405).end()
}
const getProductStore: nextFunction = (req, res, credentials) => {
	throw new Error("Function not implemented.")
}
