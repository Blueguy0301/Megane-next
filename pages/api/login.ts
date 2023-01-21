import type { NextApiRequest, NextApiResponse } from "next"
import { onlyPost } from "./middleware"
import prisma from "./db"
type Data = {}
export default async function login(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { userName, password } = req.body
	if (!userName || !password) {
		return res.status(200).json({ error: "missing parameters" })
	}
	const user = await prisma.users.findUnique({
		where: { userName: userName },
	})
	res.status(200).json({ body: req.body })
}
export const config = {
	api: {
		bodyParser: true,
		handler: (req: NextApiRequest, res: NextApiResponse<Data>) =>
			onlyPost(req, res, login),
	},
}
