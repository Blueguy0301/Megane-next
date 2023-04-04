//* time complexity: O(log n + k)
//* where n is the number of products in the array and k is the number of products that contain the search word.
interface data {
	Location: string
	price: number
	Product: {
		name: string
		mass: string
		barcode: string
	}
}
export default function searchProducts(productName: string, productsArray: data[]) {
	let cache = JSON.parse(localStorage.getItem("cache") as string) || {}
	console.log(cache[productName], 'cache');
	if (cache[productName]) return cache[productName]
	productName = productName.toLowerCase()
	productsArray.forEach((product) => {
		product.Product.name = product.Product.name.toLowerCase()
	})
	productsArray.sort((a, b) => a.Product.name.localeCompare(b.Product.name))
	let result = []
	let start = 0
	let end = productsArray.length - 1
	while (start <= end) {
		let middle = Math.floor((start + end) / 2)
		if (productsArray[middle].Product.name.includes(productName)) {
			result.push(productsArray[middle])
			let i = middle - 1
			while (i >= 0 && productsArray[i].Product.name.includes(productName)) {
				result.unshift(productsArray[i--])
			}
			i = middle + 1
			while (
				i < productsArray.length &&
				productsArray[i].Product.name.includes(productName)
			) {
				result.push(productsArray[i++])
			}
			break
		} else if (productsArray[middle].Product.name < productName) {
			start = middle + 1
		} else {
			end = middle - 1
		}
	}
	if (result.length < 1) {
		//* search api db
	} else cache[productName] = result
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
