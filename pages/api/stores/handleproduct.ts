import { NextApiRequest, NextApiResponse } from "next"
import { checkCredentials } from "../middleware"
import type { product, productStore, userData } from "../../interface"
import prisma from "../db"
export default async function handleProducts(req: NextApiRequest, res: NextApiResponse) {
	//* if statement for request method. only update, post and delete methods are allowed
	const verb = req.method
	const authorization = req.headers.authorization as string
	const credentials = await checkCredentials(authorization, res)
	if (!credentials) return
	if (verb === "POST") return addProduct(req, res, credentials)
	if (verb === "PUT") return updateProduct(req, res, credentials)
	if (verb === "DELETE") return deleteProduct(req, res, credentials)
	else return res.status(405).end()
}
const addProduct = async (
	req: NextApiRequest,
	res: NextApiResponse,
	credentials: userData
) => {
	const {} = req.body
	const exists = await prisma.product.count({
		where: {
			barcode: "",
			name: "",
		},
	})
	if (exists) {
		return
	}
	const addProduct = await prisma.product
		.create({
			data: {
				name: "",
				barcode: "",
				Category: "",
				mass: "",
			},
		})
		.then((v) => ({ ...v, id: v.id.toString() }))
}
const updateProduct = (
	req: NextApiRequest,
	res: NextApiResponse,
	credentials: userData
) => {}
const deleteProduct = (
	req: NextApiRequest,
	res: NextApiResponse,
	credentials: userData
) => {}
