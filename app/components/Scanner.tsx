/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { Html5QrcodeScanner } from "html5-qrcode"
import React, { useEffect, useRef, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import "/styles/scanner.css"
type props = { addChecking?: boolean; setLastCode: Dispatch<SetStateAction<string>> }
const handleError = (err: string) => {
	console.log("err", err)
}
const handleScan = (code: string) => {
	console.log(code)
}
const Scanner = (props: props) => {
	const { addChecking, setLastCode } = props
	// const audio = new Audio("/assets/success.mp3")
	const audio = useRef<HTMLAudioElement | undefined>(
		typeof Audio !== "undefined" ? new Audio("/assets/success.mp3") : undefined
	)
	const qrcodeRegionId = "scanner-region"
	let temp: string
	let scanner: Html5QrcodeScanner
	const qrCodeSuccessCallback = (data: string) => {
		if (data !== temp && addChecking) {
			// console.log("temp is not equal to data and addChecking.")
			audio.current?.play()
			setLastCode(data)

			temp = data
			return
		}
		if (!addChecking) {
			// console.log("no addchecking.")
			setLastCode(data)
		}
		// console.log("end")
		temp = data
	}
	const qrCodeErrorCallback: (e: any) => void = (e) => {}
	useEffect(() => {
		// console.log("ran")
		// eslint-disable-next-line react-hooks/exhaustive-deps
		scanner = new Html5QrcodeScanner(
			qrcodeRegionId,
			{
				fps: 30,
				rememberLastUsedCamera: true,
				supportedScanTypes: [],
				experimentalFeatures: {
					useBarCodeDetectorIfSupported: true,
				},
			},
			false
		)
		scanner.render(qrCodeSuccessCallback, qrCodeErrorCallback)
		// audio.play()
		return () => {
			// console.log("return ran")
			scanner.clear()
		}
	}, [])
	return <div id={qrcodeRegionId} />
}
export default Scanner
