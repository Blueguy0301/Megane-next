-- DropForeignKey
ALTER TABLE "InvoicePurchases" DROP CONSTRAINT "InvoicePurchases_productStoreId_fkey";

-- AddForeignKey
ALTER TABLE "InvoicePurchases" ADD CONSTRAINT "InvoicePurchases_productStoreId_fkey" FOREIGN KEY ("productStoreId") REFERENCES "ProductStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;
