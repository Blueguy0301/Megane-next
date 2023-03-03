import { failed, success, warning } from "@components/crudModals";
import { deleteProduct, deleteStoreProduct, updateProduct } from "@responses";
import axios from "axios"

const url = "/api/store/product"
const params = { onlyStore: true }
export const update = async (pId?: string, d?: { price: number; location: string; description: string }) => {
    const res = await axios.put<updateProduct>(url, { pId, ...d }, { params }).catch(e => ({ e }))
    if ('e' in res) return failed(res.e)
    if (res.data.error) return failed(res.data.error)
    if (res.data.result) return success("Updated successfully")

    return res
}
export const remove = async (data: string[]) => {
    const userRes = await warning(`Delete ${data.length} product/s`)
    if (!userRes.isConfirmed) return
    const res = await axios.patch<deleteProduct | deleteStoreProduct>(url, { pid: data }, { params }).catch(e => ({ e }))
    if ('e' in res) return failed(res.e)
    if (res.data.error) return failed(res.data.error)
    if (res.data.success) return success(`Deleted ${data.length} product/s`)
}