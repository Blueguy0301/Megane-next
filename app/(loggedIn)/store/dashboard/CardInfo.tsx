import type { ReactNode } from "react"
type props = {
	icon: ReactNode
	title: string
	value: string | number
	children?: ReactNode
	[x: string]: any
}
export default function CardInfo(props: props) {
	return (
		<div
			className={`card-row flex flex-grow flex-row items-center justify-center gap-3 ${
				props.className ?? ""
			}`}
		>
			<div className="icon">
				{props.icon}
				{/* <Image src={props.src} alt={props.alt} width="27" height="27" decoding="async" /> */}
			</div>
			<div className="flex flex-col">
				<h4 className="min-w-[10ch] overflow-hidden text-ellipsis whitespace-nowrap">
					{props.title}
				</h4>
				<h3 className="min-w-[10ch] max-w-[10ch] overflow-hidden text-ellipsis whitespace-nowrap">
					{props.value}
				</h3>
			</div>
			{props.children ?? <></>}
		</div>
	)
}
