/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { signIn, useSession } from "next-auth/react"
import Button from "@components/Button"
import React, { FormEvent, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { login } from "../interface"
import { useRouter } from "next/navigation"

const page = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<login>()
	const { data: session } = useSession()
	const router = useRouter()
	const onSubmit: SubmitHandler<login> = async (e) => {
		console.log(e)
		const result = await signIn("credentials", {
			username: e.username,
			password: e.password,
			redirect: true,
			callbackUrl: "/",
		})
	}
	if (session) return router.push("/dashboard")
	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor="username">username</label>
				<input type="text" {...register("username")} />
				<label htmlFor="password">password</label>
				<input type="password" {...register("password", { required: true })} />
				{errors.password && <span>This field is required</span>}
				<Button type="submit">Login</Button>
			</form>
		</div>
	)
}

export default page
