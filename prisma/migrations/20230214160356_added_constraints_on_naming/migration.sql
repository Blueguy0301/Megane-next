/*
  Warnings:

  - A unique constraint covering the columns `[storeId,customerName]` on the table `Installments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerName]` on the table `Installments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Installments_storeId_customerName_key" ON "Installments"("storeId", "customerName");

-- CreateIndex
CREATE UNIQUE INDEX "Stores" ON "Installments"("customerName");
