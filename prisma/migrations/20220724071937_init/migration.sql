-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fotoKTP" TEXT NOT NULL,
    "linkKTP" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
