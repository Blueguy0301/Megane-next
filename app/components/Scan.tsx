import { faBarcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function Scan() {
	return (
		<Link
			href="/store/checkout"
			className="scan fixed flex max-h-20 flex-col items-center justify-center rounded-full bg-blue-700 p-2 "
		>
			<FontAwesomeIcon icon={faBarcode} color="white" size="2x" />
		</Link>
	)
}
