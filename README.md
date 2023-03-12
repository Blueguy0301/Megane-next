# Megane

A point of sales system made with NextJs, Prisma and CockroachDB.

## About the project:

I am using this project to learn more about Nextjs and how SSR and ISR works. This is my first time overall to using the next environment.

## Features

1. Record products with barcodes or not.
1. Creates and scans QR codes and barcodes using your smartphone.
1. Track installments and Invoices.

## Goals :

### 1. Creates a database of products that is easily accessible.

- I saw that using an api barcode databases are not free and if they are, they have a limited bandwidth.

### 2. Learning next js

- Well this is self explanatory. Since I want to learn Next and what's so special about it, I tried making an app and possibly switch to it if I came to love it.

#### This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Starting the server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## API Routes

The API uses the following libraries :

```json
"@prisma/client": "^4.9.0",
"bcryptjs": "^2.4.3",
"next-auth": "^4.18.7",
```

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api](http://localhost:3000/api/*). This endpoint can be edited in `pages/api/*`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## To do:

1. Logo
1. optimize addProduct on `/api/product.ts`. It takes 1.5s to create a product
1. optimize installments on `/api/installment.ts`. It takes 500ms to create,update and delete an installment
1. seperate server components to client compontents
1. have page to be a server component by default. ON ALL FILES
1. change Swal color schemes
1. fix svgs
1. Button hover efffects
1. css minify
1. Qr code on generate barcode.
1. Add extra charge on checkout
1. loading screen when a Link is pressed
1. next-pwa
