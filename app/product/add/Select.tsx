"use client"
type props = {
	[x: string]: any
	setValue: any
}
const Select = (props: props) => {
	const { setValue, ...rest } = props
	return (
		<select
			{...rest}
			className="flex-grow"
			id="Category"
			onChange={(e) => setValue("Category", e.target.value)}
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
