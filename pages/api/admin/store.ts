//*checked
import type { NextApiRequest, NextApiResponse } from "next"
import { authority, nextFunction, } from "@pages/types"
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
	if (verb === "PATCH") return deleteStore(req, res, credentials)
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
			if (e.code === "P2002") return { error: `${storeName} already exists` }
			else return { error: e.code }
		})
	if ("error" in createStore) return res.json(createStore)
	else return res.json({ result: createStore })
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
			success: true,
		}))
		.catch((e) => ({ success: false, error: e }))
	return res.json(removeStore)
}
