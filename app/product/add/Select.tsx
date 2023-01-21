"use client"
import type { Dispatch, SetStateAction, ChangeEvent } from "react"
type formData = {
	name: string
	Category: string
	price: number | string
	location: string
	mass: number | string
	description: string
}
type props = {
	selected: string
	setSelected: Dispatch<SetStateAction<formData>>
	name: string
	id: string
}
const Select = (props: props) => {
	const { selected, setSelected, name, id } = props
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target
		setSelected((prev) => {
			return { ...prev, [name]: value }
		})
	}
	return (
		<select
			onChange={handleChange}
			value={selected}
			name={name}
			id={id}
			className="flex-grow"
		>
			<optgroup label="Cigarettes">
				<option value="stick">Stick</option>
				<option value="pack">Pack</option>
			</optgroup>
			<optgroup label="Food">
				<option value="weight">Weight (g)</option>
			</optgroup>
			<optgroup label="Bottles and liquids">
				<option value="volume">Volume (ML)</option>
				<option value="bottle">Bottle</option>
			</optgroup>
			<optgroup label="Others">
				<option value="piece">Piece</option>
				<option value="pack">Pack</option>
			</optgroup>
		</select>
	)
}

export default Select
