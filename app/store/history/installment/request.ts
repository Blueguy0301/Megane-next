import type { installments } from "@pages/types"
import type { addInstallment, deleteInstallment, updateInstallment } from "@responses"
import axios from "axios"
const url = "/api/store/installment"
// PUT
export const update = async (data: installments) => {
    const res = await axios.put<updateInstallment>(url, data).catch((e) => ({ e }))
    return res
}
// post
export const add = async (data: { customerName: string, total: number, isAdded: boolean }) => {
    const res = await axios.post<addInstallment>(url, data).catch((e) => ({ e }))
    return res
}
// patch
export const remove = async (data: string[] | string, controller?: AbortController) => {
    const res = await axios.patch<deleteInstallment>(url, { id: data }, { signal: controller?.signal }).catch((e) => ({ e }))
    return res
}

export const getInstallment = () => { }
