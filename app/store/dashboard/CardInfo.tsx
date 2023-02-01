import type { ReactNode } from "react"
import Image from "next/image"
type props = {
  src: string
  alt: string
  title: string
  value: string | number
  children?: ReactNode
  [x: string]: any
}
export default function CardInfo(props: props) {
  return (
    <div
      className={`flex items-center flex-row card-row gap-3 justify-center flex-grow ${
        props.className ?? ""
      }`}
    >
      <div className="icon">
        <Image
          src={props.src}
          alt={props.alt}
          width="27"
          height="27"
          decoding="async"
        />
      </div>
      <div className="card-row">
        <h4>{props.title}</h4>
        <h3>{props.value}</h3>
        {props.children ?? <></>}
      </div>
    </div>
  )
}