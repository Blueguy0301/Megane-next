/*
  Warnings:

  - Added the required column `storeId` to the `Installments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Installments" ADD COLUMN     "storeId" INT8 NOT NULL;

-- AddForeignKey
ALTER TABLE "Installments" ADD CONSTRAINT "Installments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
