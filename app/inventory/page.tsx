"use client"
import Table from "./Table"
import Button from "../components/Button"
import Image from "next/image"
export default function page() {
	return (
		<div className="page flex-col gap-3 p-4 ">
			<div className="flex w-full flex-row flex-wrap justify-center gap-3 ">
				<Button
					type="Link"
					href="/product/add"
					className="flex items-center justify-center"
				>
					Add Product
				</Button>
				<Button type="button">Delete Selected</Button>
				<Button type="button" onClick={(e) => console.log("test onClick")}>
					Update Existsing
				</Button>
				<fieldset className="flex items-center justify-center bg-gray-700 px-3 py-3 md:ml-auto">
					<Image
						src="/search.svg"
						width="27"
						height="27"
						decoding="async"
						alt=""
						className="mr-3"
					/>
					<input
						type="search"
						id="table-search"
						className="ml-auto h-full bg-white/0"
						placeholder="search"
					/>
				</fieldset>
			</div>
			<Table />
		</div>
	)
}
