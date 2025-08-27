/*
  Warnings:

  - You are about to drop the column `humidity` on the `SensorData` table. All the data in the column will be lost.
  - Added the required column `type` to the `SensorData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `SensorData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SensorData" DROP COLUMN "humidity",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "value" DECIMAL(14,2) NOT NULL;
