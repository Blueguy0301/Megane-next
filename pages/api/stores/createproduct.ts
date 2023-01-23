import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials } from "../middleware"
export default async function createproductstore(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//* if statement for request method. only update, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	// if (verb === "POST") return addProduct(req, res, credentials)
	// if (verb === "PUT") return updateProduct(req, res, credentials)
	// if (verb === "DELETE") return deleteProduct(req, res, credentials)
	else return res.status(405).end()
}
const deleteProduct = async () => {}
