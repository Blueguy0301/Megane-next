import TablePagination from "./TablePagination"
function Table() {
	return (
		<>
			<div className="flex flex-col">
				<div className="">
					<div className="overflow-auto">
						<table className="min-w-full bg-gray-800">
							<thead className="border-b bg-white/25">
								<tr>
									<th
										scope="col"
										className="w-4 px-6 py-4 text-center text-sm  font-medium text-white"
									>
										<input type="checkbox" name="all" id="all" />
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-left text-sm font-medium text-white"
									>
										Name
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-left text-sm font-medium text-white"
									>
										Mass
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-left text-sm font-medium text-white"
									>
										Barcode
									</th>

									<th
										scope="col"
										className="px-6 py-4 text-left text-sm font-medium text-white"
									>
										Location
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-left text-sm font-medium text-white"
									>
										Price
									</th>
								</tr>
							</thead>
							<tbody>
								{/* loop this */}
								{Array(50)
									.fill(0)
									.map((i, a) => (
										<tr
											className="border-b transition duration-300 ease-in-out hover:bg-gray-600"
											key={a}
											onClick={(e) => {
												console.log(`${a} has been clicked`)
											}}
										>
											<td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-white">
												<input type="checkbox" name="selected" />
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
												Mark
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
												Otto
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
												@mdo
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
												@mdo
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
												@mdo
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<TablePagination shown={50} total={50} current={1} />
		</>
	)
}

export default Table
