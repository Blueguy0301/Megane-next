/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { Html5QrcodeScanner } from "html5-qrcode"
import React, { useEffect, useState } from "react"
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
	// const audio = new Audio("/success.mp3")
	const qrcodeRegionId = "scanner-region"
	let temp: string
	let scanner: Html5QrcodeScanner
	const qrCodeSuccessCallback: (d: any, scanner: any) => void = (data) => {
		// if (data !== temp && addChecking) {
		// 	audio.play()
		// 	setLastCode(data)
		// 	if (!audio.paused) {
		// 		audio.pause()
		// 		audio.currentTime = 0
		// 	}
		// 	temp = data
		// 	return
		// }
		if (!addChecking) {
			setLastCode(data)
		}

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
				rememberLastUsedCamera: false,
				supportedScanTypes: [],
				experimentalFeatures: {
					useBarCodeDetectorIfSupported: true,
				},
			},
			false
		)
		scanner.render(qrCodeSuccessCallback, qrCodeErrorCallback)
		return () => {
			// console.log("return ran")
			scanner.clear()
		}
	}, [])
	return <div id={qrcodeRegionId} />
}
export default Scanner
