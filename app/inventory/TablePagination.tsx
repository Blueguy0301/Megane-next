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
        Showing <span className="font-semibold text-white">1</span> to{" "}
        <span className="font-semibold text-white">1</span> of{" "}
        <span className="font-semibold text-white">1</span> Entries
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          Prev
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          Next
        </button>
      </div>
    </div>
  )
}

export default TablePagination
