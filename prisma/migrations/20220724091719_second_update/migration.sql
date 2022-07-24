/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN', 'NOTVERIFIED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOTVERIFIED', 'ACCEPT', 'REFUSE');

-- CreateEnum
CREATE TYPE "Tipe" AS ENUM ('PENDAPATAN', 'PENGELUARAN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL,
ADD COLUMN     "saldo" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Transfer" (
    "idTransfer" SERIAL NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usernameSrc" TEXT NOT NULL,
    "usernameDest" TEXT NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("idTransfer")
);

-- CreateTable
CREATE TABLE "Ubah" (
    "idUbah" SERIAL NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "currency" TEXT DEFAULT 'rupiah',
    "status" "Status" NOT NULL,
    "username" TEXT NOT NULL,
    "tipe" "Tipe" NOT NULL,

    CONSTRAINT "Ubah_pkey" PRIMARY KEY ("idUbah")
);

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_usernameSrc_fkey" FOREIGN KEY ("usernameSrc") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_usernameDest_fkey" FOREIGN KEY ("usernameDest") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubah" ADD CONSTRAINT "Ubah_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
