import React from "react"
type noSelection = {
	headers: string[]
	children: React.ReactNode
}
type withSelection = {
	withSelection: true
	onSelect: React.ChangeEventHandler<HTMLInputElement>
	checked?: boolean
}
type props = (noSelection & withSelection) | (noSelection & { withSelection?: false })
const Table = (props: props) => {
	return (
		<div className="flex flex-col">
			<div className="max-w-[100%] overflow-auto">
				<table className="min-w-full  bg-gray-800">
					<thead className="border-b bg-white/25">
						<tr>
							{props.withSelection && (
								<th
									scope="col"
									className="w-4 px-6 py-4 text-center text-sm  font-medium text-white"
								>
									<input type="checkbox" name="all" id="all" onChange={props.onSelect} />
								</th>
							)}

							{props.headers.map((header, i) => (
								<th
									scope="col"
									className="px-6 py-4  text-center text-sm font-medium text-white"
									key={i}
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{/* <td className="tr-check">
								<input type="checkbox" name="selected" />
							</td>
							<td className="tr"></td> */}
						{props.children}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Table
