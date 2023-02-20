import { deleteCheckout } from "@responses"
import axios from "axios"

export const deleteInvoice = async (data: string[] | string,) => {
    const url = "/api/store/checkout"
    const res = await axios.put<deleteCheckout>(url, { data: data }).catch(e => ({ e: e }))
    return res

}