/*
  Warnings:

  - You are about to drop the column `specialties` on the `staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "staff" DROP COLUMN "specialties";

-- CreateTable
CREATE TABLE "staff_specialties" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "staff_specialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "staff_specialties" ADD CONSTRAINT "staff_specialties_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_specialties" ADD CONSTRAINT "staff_specialties_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
