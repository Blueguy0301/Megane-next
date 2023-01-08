import Image from "next/image"
import Link from "next/link"

export default function Scan() {
	return (
		<Link
			href="/product/checkout"
			className="scan fixed flex items-center rounded-full bg-blue-700 "
		>
			<Image
				className=""
				src="/bar.svg"
				width="33"
				height="29"
				alt="scan"
				decoding="async"
			/>
		</Link>
	)
}
