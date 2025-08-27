-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "hashedPassword" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
