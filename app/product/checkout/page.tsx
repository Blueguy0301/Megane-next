import { Suspense } from "react"
import PageContent from "./PageContent"
import Loading from "../loading"
const page = () => {
	console.log("product/checkout")

	return (
		<Suspense fallback={<Loading />}>
			<PageContent />
		</Suspense>
	)
}

export default page
