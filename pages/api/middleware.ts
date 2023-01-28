import type { NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken"
import { error, userData } from "../interface"
const secret = process.env.secret_key as string
const numberRegex = /^\d+$/
const salt = bcrypt.genSaltSync()
export async function checkCredentials(
	authorization: string,
	res: NextApiResponse,
	minAutorithy = 2
) {
	const token = authorization?.replace("Bearer ", "") as string
	const user = Jwt.verify(token, secret, (err, decoded) => {
		if (err) return { error: "token not valid" } as error
		else return decoded as userData
	}) as unknown as userData
	if (user?.error) return res.status(401).json({ error: "invalid credentials" })
	if (user.authorityId < minAutorithy)
		return res.status(401).json({ error: "Unauthorized" })
	return user
}
/**
 *
 * @param number
 * @returns true if the number has other characters
 */
export const testNumber = (number: any) => !numberRegex.test(number)

/**
 *
 * @param args[]
 * @returns true if all the args are not empty.
 */
export function checkIfValid(...args: any[]) {
	const data = arguments
	for (let i = 0; i < data.length; i++) {
		const element = data[i]
		if (!element) return false
		continue
	}
	return true
}

export function filter(data: object) {
	return Object.entries(data).reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: value !== "" ? value : undefined,
		}),
		{}
	)
}
/**
 *
 * @param data the new payload
 * @returns new token
 */
export async function renewToken(data: object) {
	try {
		const token = Jwt.sign(
			{ data: data, cty: "application/json", iat: Date.now() },
			secret,
			{ expiresIn: "7 days" }
		)
		return token
	} catch (e) {
		return ""
	}
}
export const hash = (password: string) => bcrypt.hashSync(password, salt)
export const compare = (password: string, passwordDB: string) =>
	bcrypt.compareSync(password, passwordDB)
