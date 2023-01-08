-- CreateTable
CREATE TABLE "Stores" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,

    CONSTRAINT "Stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "userName" STRING NOT NULL,
    "password" STRING NOT NULL,
    "authorityId" INT4 NOT NULL,
    "storeId" INT8 NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStore" (
    "productId" INT8 NOT NULL,
    "price" INT4 NOT NULL,
    "rawPrice" INT4 NOT NULL,
    "Location" STRING NOT NULL,
    "Description" STRING NOT NULL,
    "storeId" INT8 NOT NULL,

    CONSTRAINT "ProductStore_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "barcode" STRING NOT NULL,
    "Category" STRING NOT NULL,
    "mass" STRING NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "storeId" INT8 NOT NULL,
    "installmentId" INT8,
    "dateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoicePurchases" (
    "invoiceId" INT8 NOT NULL,
    "productStoreId" INT8 NOT NULL,

    CONSTRAINT "InvoicePurchases_pkey" PRIMARY KEY ("invoiceId")
);

-- CreateTable
CREATE TABLE "Installments" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "customerName" STRING NOT NULL,

    CONSTRAINT "Installments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stores_name_key" ON "Stores"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStore_productId_key" ON "ProductStore"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Installments_customerName_key" ON "Installments"("customerName");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStore" ADD CONSTRAINT "ProductStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStore" ADD CONSTRAINT "ProductStore_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoicePurchases" ADD CONSTRAINT "InvoicePurchases_productStoreId_fkey" FOREIGN KEY ("productStoreId") REFERENCES "ProductStore"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoicePurchases" ADD CONSTRAINT "InvoicePurchases_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
