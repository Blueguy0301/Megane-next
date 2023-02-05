//*checked
import type { NextApiRequest, NextApiResponse } from "next"
import { authority, nextFunction } from "../../interface"
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
	const credentials = await checkCredentials(req, res, authority.admin)
	if (!credentials) return
	if (verb === "POST") return addStore(req, res, credentials)
	if (verb === "PUT") return updateStore(req, res, credentials)
	if (verb === "DELETE") return deleteStore(req, res, credentials)
	else return res.status(405).end()
}
//* tested
const addStore: nextFunction = async (req, res) => {
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
const updateStore: nextFunction = async (req, res) => {
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
const deleteStore: nextFunction = async (req, res) => {
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
