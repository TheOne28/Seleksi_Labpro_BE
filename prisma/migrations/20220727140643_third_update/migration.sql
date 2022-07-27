/*
  Warnings:

  - The values [ACCEPT,REFUSE] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currency` on the `Ubah` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('NOTVERIFIED', 'ACCEPTED', 'REFUSED');
ALTER TABLE "Ubah" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- AlterTable
ALTER TABLE "Ubah" DROP COLUMN "currency";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'NOTVERIFIED',
ALTER COLUMN "saldo" SET DEFAULT 0;
