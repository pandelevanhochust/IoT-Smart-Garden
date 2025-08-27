/*
  Warnings:

  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prices` to the `Vegetable` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Price" DROP CONSTRAINT "Price_vegetableId_fkey";

-- AlterTable
ALTER TABLE "public"."Vegetable" ADD COLUMN     "prices" DECIMAL(14,2) NOT NULL;

-- DropTable
DROP TABLE "public"."Price";
