import axios from "axios"

const url = "/api/prodcut"
const params = { onlyStore: true }
export const update = async (d: { price: number; location: string; description: string }) => {
    const res = await axios.patch(url, d, { params })
    console.log("update")
    return res
}
export const remove = () => {
    axios.patch(url, {}, { params })

    console.log("delete")
}