import type { modal } from "@app/types"
import { authority } from "@pages/types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
type props = {
	Modal: modal
	isOpen: boolean
	modalOpened: "Store" | "User"
	handleStore: Function
	handleUser: Function
}
type newStore = { name: string }
type newUser = {
	userName: string
	password: string
	storeId: string
	authorityId: number
}
const UserModal = (props: props) => {
	const { isOpen, Modal, modalOpened } = props
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm()
	useEffect(() => {
		reset()
	}, [isOpen])
	if (modalOpened === "Store") {
		return (
			<Modal
				title="New Store"
				buttonSettings={{ type: "submit", disablehandle: "true" }}
				onAccept={handleSubmit((d) => props.handleStore({ storeName: d.name }))}
			>
				<div className="p-3">
					<div className="group">
						<label htmlFor="name">Store Name</label>
						{/* //todo : find a way to remove the autofocus here. */}
						<input
							type="text"
							id="name"
							{...register("name", { required: true })}
							autoFocus
						/>
					</div>
					{errors.name && <p className="p-2 text-center">Required</p>}
				</div>
			</Modal>
		)
	}
	if (modalOpened === "User") {
		return (
			<Modal
				title="New User"
				buttonSettings={{ type: "submit", disablehandle: "true" }}
				onAccept={handleSubmit((d) => props.handleUser(d))}
			>
				<div className="flex flex-col gap-4 p-3">
					<div className="group">
						<label htmlFor="username">Username:</label>
						{/* //todo : find a way to remove the autofocus here. */}
						<input
							type="text"
							id="username"
							{...register("username", { required: true })}
							autoFocus
						/>
					</div>
					<p className="text-center">{errors.username && "required"} &nbsp;</p>
					<div className="group">
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							{...register("password", { required: true })}
							autoFocus
						/>
					</div>
					<p className="text-center">{errors.password && "required"} &nbsp;</p>
					<div className="group">
						<label htmlFor="">Account Type : </label>
						<select
							id="name"
							{...register("authority", { required: true })}
							onChange={(e) => setValue("authority", e.target.value)}
						>
							<option value={authority.storeOwner}>Store Owner</option>
							<option value={authority.registered}>User</option>
							<option value={authority.admin}>Admin</option>
						</select>
					</div>
				</div>
			</Modal>
		)
	}
	return <></>
}

export default UserModal
