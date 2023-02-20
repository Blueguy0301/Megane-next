-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_installmentId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "extraCharges" STRING;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
