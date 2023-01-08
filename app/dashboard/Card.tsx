"use client"
import type { ReactNode } from "react"
type card = {
  className?: string
  children?: ReactNode
  [x: string]: any
}
const Card = (props: card) => {
  return (
    <div className={`bg-slate-800 card ${props.className ?? ""}`}>
      {props.children}
    </div>
  )
}

export default Card
