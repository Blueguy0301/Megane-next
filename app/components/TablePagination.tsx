"use client"
import { maxPageNumber } from "@app/types"
import type { Dispatch, SetStateAction } from "react"
type props = {
	page: number
	setPage: Dispatch<SetStateAction<number>>
	shown: number
	current: number
	total: number
}
const TablePagination = (props: props) => {
	return (
		<div className="flex flex-col items-center">
			<span className="text-sm text-white">
				Showing <span className="font-semibold text-white">{props.current}</span> to{" "}
				<span className="font-semibold text-white">{props.shown}</span>
			</span>
			<div className="xs:mt-0 mt-2 inline-flex">
				<button
					className="rounded-l px-4 py-2 text-sm font-medium text-white enabled:hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white"
					onClick={() =>
						props.setPage((prev) => {
							window.scroll({
								behavior: "smooth",
								top: 0,
							})
							if (prev > 1) {
								return prev - 1
							} else {
								return 1
							}
						})
					}
					disabled={props.page === 1}
				>
					Prev
				</button>
				<button
					className="rounded-r border-0 border-l border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white enabled:hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white "
					onClick={() => {
						props.setPage((prev) => {
							window.scroll({
								behavior: "smooth",
								top: 0,
							})
							if (Math.ceil(props.total / maxPageNumber) === prev) return prev
							else return prev + 1
						})
					}}
					disabled={Math.ceil(props.total / maxPageNumber) === props.page}
				>
					Next
				</button>
			</div>
		</div>
	)
}

export default TablePagination
