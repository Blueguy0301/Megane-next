import type { userData } from "@pages/types"
import { createStore, createUser, deleteStore } from "@responses"
import axios from "axios"
const store = '/api/admin/store'
const user = '/api/admin/user'
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
