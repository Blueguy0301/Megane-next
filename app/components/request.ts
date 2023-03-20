//todo: have all request put here.
import { installments, minCodeLength, product } from "@pages/types"
import type { checkOutBody, InvoicePurchase, } from "@pages/types"
import { addInstallment, addProduct, deleteCheckout, deleteInstallment, deleteProduct, deleteStoreProduct, storeProductScanner, GetProductOnly, updateInstallment as UpdateInstallment, updateProduct } from "@responses"
import axios from "axios"
import { formData, sendData } from "@app/types"
type checkOut = InvoicePurchase | InvoicePurchase[]
type checkOutData = {
    name?: string
    amount?: number
    barcode?: string

}
interface data {
    Location: string
    price: number
    Product: {
        name: string
        mass: string
        barcode: string
    }
    id: string
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

export const scannerRequest = async (code: string, controller: AbortController, params?: object) => {
    if (!(code.length >= minCodeLength))
        return {
            data: { result: {} },
            error: {},
        } as { data: storeProductScanner; error: any }
    const product = await axios
        .get<storeProductScanner>(scannerURL, {
            params: params ?? { barcode: code, storeScan: true },
            signal: controller.signal,
        })
        .catch((e) => ({ e: e }))
    return product
}
export const checkOut = async (
    products: checkOut,
    total: number,
    formData: checkOutData,
    isCredited = false,
    charges: string
) => {
    const body: checkOutBody = {
        productList: products,
        total,
        customerName: formData.name,
        isCredited,
        creditTotal: isCredited ? total - (formData.amount ?? 0) : 0,
        extraCharges: charges

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
    const res = await axios.patch<deleteProduct | deleteStoreProduct>(productURL, { pId: data }, { params }).catch(e => ({ e }))
    return res

}
export const getNextProducts = async (page: number) => {
    const params = { page }
    //todo : add controller later
    const res = await axios.get(productURL, { params })
    return res.data.result as unknown as data[]
}
//! temp. add to adminReques.ts
export const updateProductCode = async (barcode: string, newBarcode: string) => {
    const res = await axios.put<addProduct>(productURL, { barcode, newBarcode }).catch(e => ({ e }))

    return res
}
export const getProductOnly = async (page: number) => {
    const res = await axios.get<GetProductOnly>(productURL, { params: { adminOnly: true, page } }).catch(e => ({ e }))
    return res
}