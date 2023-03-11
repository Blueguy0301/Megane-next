

//* time complexity: O(log n + k)
//* where n is the number of products in the array and k is the number of products that contain the search word.
interface data {
    id: string
    dateTime: string
    total: number
    Installment: string
}
export default function searchProducts(productName: string, invoiceArray: data[]) {
    let cache = JSON.parse(localStorage.getItem("cache") as string) || {}
    if (cache[productName]) {
        return cache[productName]
    }
    productName = productName.toLowerCase()
    invoiceArray.forEach((invoice) => {
        invoice.Installment = invoice.Installment.toLowerCase()
    })
    invoiceArray.sort((a, b) => a.Installment.localeCompare(b.Installment))
    let result = []
    let start = 0
    let end = invoiceArray.length - 1
    while (start <= end) {
        let middle = Math.floor((start + end) / 2)
        if (invoiceArray[middle].Installment.includes(productName)) {
            result.push(invoiceArray[middle])
            let i = middle - 1
            while (i >= 0 && invoiceArray[i].Installment.includes(productName)) {
                result.unshift(invoiceArray[i--])
            }
            i = middle + 1
            while (
                i < invoiceArray.length &&
                invoiceArray[i].Installment.includes(productName)
            ) {
                result.push(invoiceArray[i++])
            }
            break
        } else if (invoiceArray[middle].Installment < productName) {
            start = middle + 1
        } else {
            end = middle - 1
        }
    }
    cache[productName] = result
    localStorage.setItem("cache", JSON.stringify(cache))
    return result
}
export function removeDuplicates(array: data[]) {
    const set = new Set()
    array.forEach((obj) => {
        set.add(JSON.stringify(obj))
    })
    return Array.from(set).map((objStr) => JSON.parse(objStr as string))
}
