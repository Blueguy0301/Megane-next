//* done and checked
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../db"
import { checkCredentials, testNumber } from "../middleware"
import type { user, userData } from "../../interface"

function checkIfValid({ userName, password, storeId }: user, res: NextApiResponse) {
	if (!userName || !password || !storeId) return res.json({ error: "no data found" })
	if (!testNumber(storeId) || userName.length > 20)
		return res.json({ error: "invalid arguments" })
	return true
}
export default async function handleUser(req: NextApiRequest, res: NextApiResponse) {
	//* if statement for request method. only update, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res, 3)
	if (!credentials) return
	if (verb === "POST") return addUser(req, res)
	if (verb === "UPDATE") return updateUser(req, res)
	if (verb === "DELETE") return deleteUser(req, res)
	else return res.status(405).end()
}
const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userName, password, storeId, authorityId }: userData = req.body
	if (!checkIfValid({ userName, password, storeId }, res)) return

	const create = await prisma.users
		.create({
			data: {
				userName: userName,
				password: password,
				storeId: BigInt(storeId),
				authorityId: authorityId ?? 1,
			},
		})
		.then((v) => ({
			...v,
			storeId: v.storeId.toString(),
			id: v.id.toString(),
		}))
		.catch((e) => e)
	return res.json({ result: create })
}
const updateUser = (req: NextApiRequest, res: NextApiResponse) => {}
const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userName, id } = req.body
	const removeUser = await prisma.users
		.deleteMany({
			where: {
				id: BigInt(id),
				userName: userName,
			},
		})
		.catch((e) => e)
	return res.json({ result: removeUser })
}
