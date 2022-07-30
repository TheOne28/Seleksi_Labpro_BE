/*
  Warnings:

  - The values [REFUSED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDAPATAN,PENGELUARAN] on the enum `Tipe` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('NOTVERIFIED', 'ACCEPTED', 'REJECTED');
ALTER TABLE "Ubah" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ubah" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Ubah" ALTER COLUMN "status" SET DEFAULT 'NOTVERIFIED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Tipe_new" AS ENUM ('PENAMBAHAN', 'PENGURANGAN');
ALTER TABLE "Ubah" ALTER COLUMN "tipe" TYPE "Tipe_new" USING ("tipe"::text::"Tipe_new");
ALTER TYPE "Tipe" RENAME TO "Tipe_old";
ALTER TYPE "Tipe_new" RENAME TO "Tipe";
DROP TYPE "Tipe_old";
COMMIT;
