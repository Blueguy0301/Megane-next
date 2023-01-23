import type { NextApiResponse } from "next"
import Jwt from "jsonwebtoken"
import { error, userData } from "../interface"
const secret = "your-256-bit-secret"
const numberRegex = /^\d+$/

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
export const testNumber = (number: string) => !numberRegex.test(number)

/**
 *
 * @param args[]
 * @returns true if all the args are not empty.
 */
export function checkIfValid(args: string | number | object | Array<any>) {
	const data = arguments
	for (let i = 0; i < data.length; i++) {
		const element = data[i]
		if (!element) return false
		continue
	}
	return true
}
