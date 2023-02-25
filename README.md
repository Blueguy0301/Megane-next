# Megane

A point of sales system made with NextJs, Prisma and CockroachDB.

## Features

1. Record products with barcodes or not.
1. Creates and scans qr codes and barcodes based using your smartphone.
1. Track installments and Invoices.

#### This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## About the cert folder

The `cert` folder have the ip address certificate for a secure cert (mkcert used).
you can create your own or used the one provided.

## Starting the server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## API Routes

The API uses the following libraries :

```json
"@prisma/client": "^4.9.0",
"bcryptjs": "^2.4.3",
"jsonwebtoken": "^9.0.0",
"next-auth": "^4.18.7",
```

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api](http://localhost:3000/api/*). This endpoint can be edited in `pages/api/*`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## User Previlages

1 : User is a guest

2 : User is registered

3 : User is a store Owner

4 : User is an admin

## To do:

1. Logo
1. optimize addProduct on `/api/product.ts`. It takes 1.5s to create a product
1. optimize installments on `/api/installment.ts`. It takes 500ms to create,update and delete an installment
1. seperate server components to client compontents
1. have page to be a server component by default. ON ALL FILES
1. change Swal color schemes
1. Connect delete and update buttons to api
1. fix svgs
1. Button hover efffects
1. css minify
1. Qr code on generate barcode.
1. Add extra charge on checkout
