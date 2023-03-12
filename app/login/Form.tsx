"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import { signIn } from "next-auth/react"
import { SubmitHandler, useForm } from "react-hook-form"
import Button from "@components/Button"
import { login } from "@app/types"
import Image from "next/image"
import { useState } from "react"
import "@css/loading.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
type props = {
	error?: string
}
const Form = (props: props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<login>()
	const onSubmit: SubmitHandler<login> = async (e) => {
		setIsLoggingIn(true)
		const result = await signIn("credentials", {
			username: e.username,
			password: e.password,
			callbackUrl: "/store/dashboard",
			redirect: true,
		})
	}
	const [isLoggingIn, setIsLoggingIn] = useState(false)
	return (
		<div className="flex flex-grow flex-col items-center justify-center gap-4">
			<div className="mx-auto flex flex-col items-center gap-1 py-2">
				<Image src="/Logo.png" alt="Logo" width={90} height={64} decoding="sync" />
				<h3>Megane</h3>
			</div>
			<h1 className="">Login</h1>
			<div className=" rounded-md bg-gray-800">
				<form onSubmit={handleSubmit(onSubmit)} className="login-form ">
					<fieldset
						disabled={isLoggingIn}
						className="flex flex-col items-center gap-4 p-5 disabled:opacity-50  "
					>
						<FontAwesomeIcon icon={faUser} className="fa-3x fa-inverse" />

						<label htmlFor="username">Username</label>
						<input type="text" {...register("username")} className="login-input" />
						<label htmlFor="password">Password</label>
						<input
							type="password"
							{...register("password", { required: true })}
							className="login-input"
						/>
						{errors.password && (
							<span className="text-white">This field is required</span>
						)}
						{props.error && (
							<span className="w-55 text-white">Incorrect credentials. Try Again</span>
						)}
						<div className="relative flex items-center gap-4">
							<Button type="submit" disabled={isLoggingIn}>
								Login
							</Button>
							{isLoggingIn && (
								<div className="loadingio-spinner-spinner-is6ysog5o1d small">
									<span className="loader small"></span>
								</div>
							)}
						</div>
					</fieldset>
				</form>
			</div>
		</div>
	)
}

export default Form
