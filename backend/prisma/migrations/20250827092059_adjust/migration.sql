/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Vegetable` table. All the data in the column will be lost.
  - You are about to drop the column `prices` on the `Vegetable` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vegetable` table. All the data in the column will be lost.
  - Added the required column `price` to the `Vegetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Vegetable" DROP COLUMN "createdAt",
DROP COLUMN "prices",
DROP COLUMN "updatedAt",
ADD COLUMN     "price" DECIMAL(14,2) NOT NULL;
