/* ---------- enums ---------- */
-- CreateEnum (safe if already present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
                 WHERE t.typname = 'Role' AND n.nspname = 'public') THEN
    CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');
  END IF;
END$$;

/* ---------- foreign keys to be dropped ---------- */
-- DropForeignKey (safe)
ALTER TABLE IF EXISTS "public"."Post"    DROP CONSTRAINT IF EXISTS "Post_userId_fkey";
ALTER TABLE IF EXISTS "public"."Profile" DROP CONSTRAINT IF EXISTS "Profile_userId_fkey";

/* ---------- indexes to be dropped ---------- */
-- DropIndex (safe)
DROP INDEX IF EXISTS "public"."User_username_key";

/* ---------- user table changes ---------- */
ALTER TABLE "public"."User"
  DROP COLUMN IF EXISTS "hashedPassword",
  DROP COLUMN IF EXISTS "username",
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3),
  ALTER COLUMN "name" DROP NOT NULL,
  DROP COLUMN IF EXISTS "role",
  ADD COLUMN IF NOT EXISTS "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- Backfill updatedAt for existing rows, then enforce NOT NULL and default
UPDATE "public"."User"
SET "updatedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP);

ALTER TABLE "public"."User"
  ALTER COLUMN "updatedAt" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

/* ---------- tables dropped ---------- */
DROP TABLE IF EXISTS "public"."Post";
DROP TABLE IF EXISTS "public"."Profile";

/* ---------- new tables ---------- */
CREATE TABLE IF NOT EXISTS "public"."Garden" (
    "id"        SERIAL       NOT NULL,
    "name"      TEXT         NOT NULL,
    "ownerId"   INTEGER      NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Garden_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."Vegetable" (
    "id"          SERIAL       NOT NULL,
    "name"        TEXT         NOT NULL,
    "importedQty" INTEGER      NOT NULL DEFAULT 0,
    "soldQty"     INTEGER      NOT NULL DEFAULT 0,
    "gardenId"    INTEGER      NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Vegetable_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."Price" (
    "id"            SERIAL        NOT NULL,
    "vegetableId"   INTEGER       NOT NULL,
    "value"         DECIMAL(12,2) NOT NULL,
    "effectiveFrom" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo"   TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."Sale" (
    "id"          SERIAL        NOT NULL,
    "gardenId"    INTEGER       NOT NULL,
    "vegetableId" INTEGER       NOT NULL,
    "quantity"    INTEGER       NOT NULL,
    "totalAmount" DECIMAL(14,2) NOT NULL,
    "soldAt"      TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."SensorData" (
    "id"         SERIAL       NOT NULL,
    "gardenId"   INTEGER      NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity"    DOUBLE PRECISION NOT NULL,
    "recordedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

/* ---------- foreign keys ---------- */
ALTER TABLE "public"."Garden"
  ADD CONSTRAINT "Garden_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Vegetable"
  ADD CONSTRAINT "Vegetable_gardenId_fkey"
  FOREIGN KEY ("gardenId") REFERENCES "public"."Garden"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Price"
  ADD CONSTRAINT "Price_vegetableId_fkey"
  FOREIGN KEY ("vegetableId") REFERENCES "public"."Vegetable"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Sale"
  ADD CONSTRAINT "Sale_gardenId_fkey"
  FOREIGN KEY ("gardenId") REFERENCES "public"."Garden"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Sale"
  ADD CONSTRAINT "Sale_vegetableId_fkey"
  FOREIGN KEY ("vegetableId") REFERENCES "public"."Vegetable"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."SensorData"
  ADD CONSTRAINT "SensorData_gardenId_fkey"
  FOREIGN KEY ("gardenId") REFERENCES "public"."Garden"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
