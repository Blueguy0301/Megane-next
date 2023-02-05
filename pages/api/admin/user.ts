import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../db"
import { checkCredentials, hash, testNumber } from "../middleware"
import { authority, nextFunction, user, userData } from "../../interface"

function checkIfValid({ userName, password, storeId }: user, res: NextApiResponse) {
	if (!userName || !password || !storeId) return res.json({ error: "no data found" })
	if (testNumber(storeId) || userName.length > 20) {
		console.log(!testNumber(storeId), userName.length > 20)
		return res.json({ error: "invalid arguments" })
	}
	return true
}
export default async function handleUser(req: NextApiRequest, res: NextApiResponse) {
	//* if statement for request method. only update, post and delete methods are allowed
	const verb = req.method
	const credentials = await checkCredentials(req, res, authority.admin)
	if (!credentials) return
	if (verb === "POST") return addUser(req, res, credentials)
	// if (verb === "UPDATE") return updateUser(req, res)
	if (verb === "DELETE") return deleteUser(req, res, credentials)
	else return res.status(405).end()
}
//* tested
const addUser: nextFunction = async (req, res) => {
	const { userName, password, storeId, authorityId }: userData = req.body
	if (!checkIfValid({ userName, password, storeId }, res)) return

	const create = await prisma.users
		.create({
			data: {
				userName: userName,
				password: hash(password),
				storeId: BigInt(storeId),
				authorityId: Number(authorityId) ?? authority.registered,
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
	return res.json({ result: create })
}

//* tested
const deleteUser: nextFunction = async (req, res) => {
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
