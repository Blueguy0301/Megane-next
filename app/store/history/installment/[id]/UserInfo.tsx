"use client"
import type { installments } from "@pages/types"
import useModal from "@components/useModal"
import React, { useCallback } from "react"
import { removeInstallment, updateInstallment } from "@components/request"
import Button from "@components/Button"
import { failed, success, warning } from "../swalModal"
import ModalForms from "../ModalForms"
type props = {
	data: {
		customerName: string | undefined
		total: number | undefined
		Invoice:
			| {
					id: string
					total: number
					dateTime: string
			  }[]
			| undefined
	}
	id: string
}
const UserInfo = ({ data, id }: props) => {
	const updateController = new AbortController()
	const { Modal, setIsOpen, isOpen, Open } = useModal()
	const installmentValue: installments = {
		id,
		customerName: data.customerName ?? "",
		total: 0,
		isAdded: false,
	}
	const handleUpdate = useCallback(() => {
		return async () => {
			const response = await updateInstallment(installmentValue)
			if (!response || "e" in response) return
			const { result, error } = response.data
			if (!result && error) return failed(error)
			else {
				setIsOpen(false)
				return success()
			}
		}
	}, [])
	const handleDelete = async () => {
		const response = await warning()
		if (!response.isConfirmed) return
		const res = await removeInstallment(id)
		if (!res || "e" in res) return
		const { success: deleteSuccess, error } = res.data
		if (!deleteSuccess && error) return failed(error)
		else {
			//todo : navigate back to installments tab
			return success("Delete Sucessfull")
		}
	}
	return (
		<>
			<ModalForms modalOpened="update" modal={Modal} isOpen={isOpen} selected={id} />
			<h2>Installment history </h2>
			<div className="flex flex-row items-start justify-center">
				<div className="">
					<p>User : {data?.customerName}</p>
					<p>Total Unpaid : PHP {data?.total}</p>
				</div>
				<div className=" ml-auto flex items-center gap-4">
					<Open type="button" className="green ml-auto">
						Update
					</Open>
					<Button type="button" className="red ml-auto" onClick={handleDelete}>
						Delete
					</Button>
				</div>
			</div>
			<h3>Invoice History:</h3>
		</>
	)
}

export default UserInfo
