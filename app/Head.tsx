export default function Head({ title }: { title: string }) {
	return (
		<>
			<meta charSet="UTF-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			<link rel="manifest" href="/manifest.json" />
			<link rel="apple-touch-icon" href="/icon.png" />
			<meta name="theme-color" content="#0f172a" />
			<title>{title}</title>
		</>
	)
}
