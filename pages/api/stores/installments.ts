import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials } from "../middleware"

export default async function handleInstallments(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//* if statement for request method. only get, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	if (verb === "POST") return addInstallment(req, res)
	if (verb === "DELETE") return deleteInstallment(req, res)
	if (verb === "GET") return getInstallment(req, res)
	if (verb === "PUT") return updateInstallment(req, res)
	else return res.status(405).end()
}
function addInstallment(req: NextApiRequest, res: NextApiResponse<any>) {
	throw new Error("Function not implemented.")
}

function deleteInstallment(req: NextApiRequest, res: NextApiResponse<any>) {
	throw new Error("Function not implemented.")
}
function getInstallment(req: NextApiRequest, res: NextApiResponse<any>) {
	throw new Error("Function not implemented.")
}
function updateInstallment(req: NextApiRequest, res: NextApiResponse<any>) {
	throw new Error("Function not implemented.")
}
