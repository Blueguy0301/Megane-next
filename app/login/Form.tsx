"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import { signIn, useSession } from "next-auth/react"
import { SubmitHandler, useForm } from "react-hook-form"
import Button from "@components/Button"
import { login } from "@app/types"
import Image from "next/image"
import React from "react"
const Form = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<login>()
	const onSubmit: SubmitHandler<login> = async (e) => {
		const result = await signIn("credentials", {
			username: e.username,
			password: e.password,
			callbackUrl: "/store/dashboard",
			redirect: true,
		})
	}
	return (
		<div className="flex flex-grow flex-col items-center justify-center gap-4">
			<div className="mx-auto flex flex-col items-center gap-1 py-2">
				<Image src="/Logo.png" alt="Logo" width={90} height={64} decoding="sync" />
				<h3>Megane</h3>
			</div>
			<h1 className="">Login</h1>
			<div className=" rounded-md bg-blue-700">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="login-form flex flex-col items-center gap-4 p-5 "
				>
					<Image src="/user.svg" alt="user" width={40} height={40} />

					<label htmlFor="username">Username</label>
					<input type="text" {...register("username")} className="login-input" />
					<label htmlFor="password">Password</label>
					<input
						type="password"
						{...register("password", { required: true })}
						className="login-input"
					/>
					{errors.password && <span>This field is required</span>}
					<Button type="submit">Login</Button>
				</form>
			</div>
		</div>
	)
}

export default Form
