import type { installments } from "@pages/types"
import type { deleteInstallment, updateInstallment } from "@responses"
import axios from "axios"

// PUT
export const update = async (data: installments, controller: AbortController) => {
    const res = await axios.put<updateInstallment>("/api/store/installment", data, { signal: controller.signal }).catch((e) => ({ e }))
    return res
}
// post
export const add = async () => {
    //* delete checking
    // if (!response || "e" in response) return
    // const { result, error } = response.data as productScanner
    // if (!result && error) {
    //     return swalModal.fire({
    //         title: "Error",
    //         showConfirmButton: false,
    //         text: (error as string) ?? "An error has occured",
    //         timer: 5000,
    //         icon: "error",
    //     })
    // }
    // if (!result?.isStoreNew) {
    //     return swalModal.fire({
    //         title: "Error",
    //         showConfirmButton: false,
    //         text: `${result?.name} is already registered to the store.`,
    //         timer: 5000,
    //         icon: "error",
    //     })
    // }
}
// patch
export const remove = async (data: { id: string }[] | { id: string }, controller?: AbortController) => {
    const res = await axios.patch<deleteInstallment>("/api/store/installment", data, { signal: controller?.signal }).catch((e) => ({ e }))
    return res
}

export const getInstallment = () => { }