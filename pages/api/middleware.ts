import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken"
import { authority, error, payload, userData } from "../interface"
import { authOptions } from "./auth/[...nextauth]"
import { getServerSession, Session } from "next-auth"
const secret = process.env.secret_key as string
const numberRegex = /^\d+$/
const salt = bcrypt.genSaltSync()
export async function checkCredentials(
	req: NextApiRequest,
	res: NextApiResponse,
	minAutorithy = authority.registered
) {
	const { user } = (await getServerSession(req, res, authOptions)) as Session
	if (!user) return res.status(401).json({ error: "unauthorized" })
	// console.log("user", user)
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
export function renewToken(data: object) {
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
