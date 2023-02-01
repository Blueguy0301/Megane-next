import React from "react"
type props = {
	shown: number
	current: number
	total: number
}
const TablePagination = (props: props) => {
	return (
		<div className="flex flex-col items-center">
			<span className="text-sm text-white">
				Showing <span className="font-semibold text-white">{props.current}</span> to{" "}
				<span className="font-semibold text-white">{props.shown}</span> of{" "}
				<span className="font-semibold text-white">{props.total}</span> Entries
			</span>
			<div className="xs:mt-0 mt-2 inline-flex">
				<button className="rounded-l bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
					Prev
				</button>
				<button className="rounded-r border-0 border-l border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
					Next
				</button>
			</div>
		</div>
	)
}

export default TablePagination
