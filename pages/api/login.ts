import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "./db"
import { compare, renewToken } from "./middleware"
export default async function login(req: NextApiRequest, res: NextApiResponse) {
	const { userName, password } = req.body
	const user = await prisma.users
		.findUnique({
			where: { userName: userName },
		})
		.then((d) => ({
			id: d?.id.toString(),
			authorityId: d?.authorityId,
			storeId: d?.storeId.toString(),
			userName: d?.userName,
			password: d?.password,
		}))
	if (!user.password) return res.json({ error: "invalid username or password" })
	const isCorrect = compare(password, user.password)
	if (!isCorrect) return res.json({ error: "invalid username or password" })
	const token = renewToken({
		id: user.id,
		authorityId: user.authorityId,
		storeId: user.storeId,
		userName: user.userName,
	})
	if (token === "") return res.json({ error: "invalid token." })
	return res.json({ token: token })
}
