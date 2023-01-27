//*checked
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../db"
import { checkCredentials, testNumber } from "../middleware"
type body = { storeId: string; storeName: string }
function checkIfValid({ storeId, storeName }: body, res: NextApiResponse) {
	if (!storeId || !storeName) return res.json({ error: "no data found" })
	if (testNumber(storeId)) return res.json({ error: "invalid arguments" })
	return true
}
export default async function handleStore(req: NextApiRequest, res: NextApiResponse) {
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	if (verb === "POST") return addStore(req, res)
	if (verb === "PUT") return updateStore(req, res)
	if (verb === "DELETE") return deleteStore(req, res)
	else return res.status(405).end()
}
//* tested
const addStore = async (req: NextApiRequest, res: NextApiResponse) => {
	console.log(req.body)
	const { storeName } = req.body
	if (!storeName) return res.json({ error: "invalid arguments" })
	const createStore = await prisma.stores
		.create({
			data: {
				name: storeName,
			},
		})
		.then((v) => ({
			...v,
			id: v.id.toString(),
		}))
		.catch((e) => {
			if (e.code === "P2002") return `${storeName} already exists`
			else return e.code
		})
	return res.json({ result: createStore })
}
//* tested
const updateStore = async (req: NextApiRequest, res: NextApiResponse) => {
	const { storeId, storeName } = req.body
	if (!checkIfValid({ storeId, storeName }, res)) return
	const updateStore = await prisma.stores
		.update({
			where: {
				id: BigInt(storeId),
			},
			data: {
				name: storeName,
			},
		})
		.then((v) => ({ ...v, id: v.id.toString() }))
		.catch((e) => e.meta.cause)
	return res.json({ result: updateStore })
}
//* tested
const deleteStore = async (req: NextApiRequest, res: NextApiResponse) => {
	const { storeId, storeName } = req.body
	if (!checkIfValid({ storeId, storeName }, res)) return
	const removeStore = await prisma.stores
		.delete({
			where: {
				id: BigInt(storeId),
			},
		})
		.then(() => ({
			deleted: true,
		}))
		.catch((e) => e)
	return res.json({ result: removeStore })
}