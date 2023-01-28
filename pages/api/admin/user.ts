import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../db"
import { checkCredentials, hash, testNumber } from "../middleware"
import type { user, userData } from "../../interface"

function checkIfValid({ userName, password, storeId }: user, res: NextApiResponse) {
	if (!userName || !password || !storeId) return res.json({ error: "no data found" })
	if (testNumber(storeId) || userName.length > 20) {
		console.log(!testNumber(storeId), userName.length > 20)
		console.log("pasok")
		return res.json({ error: "invalid arguments" })
	}
	return true
}
export default async function handleUser(req: NextApiRequest, res: NextApiResponse) {
	//* if statement for request method. only update, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res, 3)
	if (!credentials) return
	if (verb === "POST") return addUser(req, res)
	// if (verb === "UPDATE") return updateUser(req, res)
	if (verb === "DELETE") return deleteUser(req, res)
	else return res.status(405).end()
}
//* tested
const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userName, password, storeId, authorityId }: userData = req.body
	if (!checkIfValid({ userName, password, storeId }, res)) return
	const create = await prisma.users
		.create({
			data: {
				userName: userName,
				password: hash(password),
				storeId: BigInt(storeId),
				authorityId: Number(authorityId) ?? 2,
			},
		})
		.then(() => ({ success: true }))
		.catch((e) => {
			if (e.code === "P2002") {
				return {
					success: false,
					error: `${userName} is already taken`,
				}
			} else {
				return e.code
			}
		})
	return res.json(create)
}

//* tested
const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userName, id, storeId } = req.body
	const removeUser = await prisma.users
		.deleteMany({
			where: {
				AND: [{ id: BigInt(id) }, { storeId: BigInt(storeId) }, { userName: userName }],
			},
		})
		.catch((e) => e)
	return res.json({ result: removeUser })
}
