import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials } from "../middleware"

export default async function handleCheckout(req: NextApiRequest, res: NextApiResponse) {
	//* if statement for request method. only get, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	if (verb === "POST") return addCheckOut(req, res)
	if (verb === "DELETE") return deleteCheckOut(req, res)
	if (verb === "GET") return getCheckOut(req, res)
	else return res.status(405).end()
}

const getCheckOut = (req: NextApiRequest, res: NextApiResponse) => {}
const addCheckOut = (req: NextApiRequest, res: NextApiResponse) => {}
const deleteCheckOut = (req: NextApiRequest, res: NextApiResponse) => {}
