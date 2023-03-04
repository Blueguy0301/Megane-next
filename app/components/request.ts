//todo: have all request put here.
import { installments, minCodeLength } from "@pages/types"
import type { checkOutBody, InvoicePurchase, } from "@pages/types"
import type { addInstallment, deleteCheckout, deleteInstallment, deleteProduct, deleteStoreProduct, storeProductScanner, updateInstallment as UpdateInstallment, updateProduct } from "@responses"
import axios from "axios"
import { formData, sendData } from "@app/types"
import { failed, success, warning } from "./crudModals"

type checkOut = InvoicePurchase | InvoicePurchase[]
type checkOutData = {
    name?: string
    amount?: number
    barcode?: string

}
const installmentURL = "/api/store/installment"
const invoiceURL = "/api/store/checkout"
const scannerURL = "/api/store/scanner"
const checkoutURL = "/api/store/checkout"
const productURL = "/api/store/product"

export const deleteInvoice = async (data: string[] | string,) => {
    const res = await axios.put<deleteCheckout>(invoiceURL, { data: data }).catch(e => ({ e: e }))
    return res
}

export const scannerRequest = async (code: string, controller: AbortController) => {
    if (!(code.length >= minCodeLength))
        return {
            data: { result: {} },
            error: {},
        } as { data: storeProductScanner; error: any }
    const product = await axios
        .get<{ data?: storeProductScanner }>(scannerURL, {
            params: { barcode: code, storeScan: true },
            signal: controller.signal,
        })
        .catch((e) => ({ e: e }))
    return product
}
export const checkOut = async (
    products: checkOut,
    total: number,
    formData: checkOutData,
    isCredited = false
) => {
    const body: checkOutBody = {
        productList: products,
        total,
        customerName: formData.name,
        isCredited,
        creditTotal: isCredited ? total - (formData.amount ?? 0) : 0
    }
    const result = await axios.post(checkoutURL, body).catch((e) => ({ e: e }))
    return result
}
export const createInstallment = async (data: { customerName: string, total: number, isAdded: boolean }) => {
    const res = await axios.post<addInstallment>(installmentURL, data).catch((e) => ({ e }))
    return res

}
export const getInstallment = async () => { }
export const updateInstallment = async (data: installments) => {
    const res = await axios.put<UpdateInstallment>(installmentURL, data).catch((e) => ({ e }))
    return res

}
export const removeInstallment = async (data: string[] | string, controller?: AbortController) => {
    const res = await axios.patch<deleteInstallment>(installmentURL, { id: data }, { signal: controller?.signal }).catch((e) => ({ e }))
    return res
}
export const newProduct = (
    data: formData,
    isStoreNew: boolean,
    barcode: string,
    pid = ""
) => {
    let params: object = isStoreNew ? { isStoreNew: true } : {}
    let dataSending: sendData
    if (pid !== "") {
        params = { ...params, pId: pid }
        dataSending = {
            price: data.price,
            location: data.location,
            description: data.description,
        }
    } else {
        dataSending = {
            barcode: barcode,
            name: data.name,
            category: data.Category,
            mass: data.mass,
            price: data.price,
            location: data.location,
            description: data.description,
        }
    }
    return axios.post(productURL, dataSending, { params })
}
export const inventoryUpdate = async (pId?: string, d?: { price: number; location: string; description: string }) => {
    const params = { onlyStore: true }
    const res = await axios.put<updateProduct>(productURL, { pId, ...d }, { params }).catch(e => ({ e }))
    return res
}
export const removeProduct = async (data: string[]) => {
    const params = { onlyStore: true }
    const userRes = await warning(`Delete ${data.length} product/s`)
    if (!userRes.isConfirmed) return
    const res = await axios.patch<deleteProduct | deleteStoreProduct>(productURL, { pid: data }, { params }).catch(e => ({ e }))
    if ('e' in res) return failed(res.e)
    if (res.data.error) return failed(res.data.error)
    if (res.data.success) return success(`Deleted ${data.length} product/s`)
}