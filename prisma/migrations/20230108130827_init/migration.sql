-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_installmentId_fkey";

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
