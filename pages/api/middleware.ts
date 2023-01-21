import type { NextApiRequest, NextApiResponse } from "next"
import Jwt from "jsonwebtoken"
import { error, userData } from "../interface"
const secret = "your-256-bit-secret"
const numberRegex = /^\d+$/

export const onlyGet = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
	if (req.method === "GET") {
		next()
	} else {
		res.status(405).json({ message: "Method Not Allowed" })
	}
}

export const onlyPost = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
	if (req.method === "POST") {
		next()
	} else {
		res.status(405).json({ message: "Method Not Allowed" })
	}
}

export const onlyPut = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
	if (req.method === "PUT") {
		next()
	} else {
		res.status(405).json({ message: "Method Not Allowed" })
	}
}
export async function checkCredentials(
	authorization: string,
	res: NextApiResponse,
	minAutorithy = 2
) {
	const token = authorization?.replace("Bearer ", "") as string
	const user = Jwt.verify(token, secret, (err, decoded) => {
		if (err) {
			return { error: "token not valid" } as error
		}
		return decoded as userData
	}) as unknown as userData
	if (user?.error) return res.status(401).json({ error: "invalid credentials" })
	if (user.authorityId < minAutorithy)
		return res.status(401).json({ error: "Unauthorized" })
	return user
}
/**
 *
 * @param number
 * @returns true if the string number has other characters
 */
export const testNumber = (number: string) => {
	return !numberRegex.test(number)
}
