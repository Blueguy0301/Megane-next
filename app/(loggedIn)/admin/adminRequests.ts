import type { userData } from "@pages/types"
import { addProduct, createStore, createUser, deleteProduct, deleteStore, GetProductOnly } from "@responses"
import axios from "axios"
const store = '/api/admin/store'
const user = '/api/admin/user'
const productURL = "/api/store/product"

type deleteData = {
    storeId: string
    storeName: string
}
type newStore = {
    storeName: string,
}
export const addUser = async (data: userData) => {
    const res = await axios.post<createUser>(user, data)
    return res
}
export const deleteData = async (data: deleteData) => {
    const res = await axios.patch<deleteStore>(store, data,)
    return res

}
export const newStore = async (data: newStore) => {
    const res = await axios.post<createStore>(store, data).catch(e => ({ e }))
    return res
}
export const DeleteProduct = async (data: string[]) => {
    const res = await axios.patch<deleteProduct>(productURL, { pId: data }).catch(e => ({ e }))
    return res
}
export const updateProductCode = async (barcode: string, newBarcode: string) => {
    const res = await axios.put<addProduct>(productURL, { barcode, newBarcode }).catch(e => ({ e }))

    return res
}
export const getProductOnly = async (page: number) => {
    const res = await axios.get<GetProductOnly>(productURL, { params: { adminOnly: true, page } }).catch(e => ({ e }))
    return res
}