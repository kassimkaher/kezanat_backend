-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('ADMIN', 'COMPANY', 'USER');

-- CreateEnum
CREATE TYPE "Sajda" AS ENUM ('NONE', 'OPTIONAL', 'REQUIRED');

-- CreateEnum
CREATE TYPE "BookType" AS ENUM ('INDEX', 'BOOK', 'CONTENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gander" TEXT NOT NULL,
    "onesignal_id" TEXT,
    "role_id" "UserRoles" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT NOT NULL,
    "verified_date" TIMESTAMP(3) NOT NULL,
    "barthday" TIMESTAMP(3) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "posts_id" TEXT,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "hijreeMarabic_month_name" TEXT NOT NULL,
    "english_date" TIMESTAMP(3) NOT NULL,
    "arabic_date" TIMESTAMP(3) NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ayah" (
    "id" SERIAL NOT NULL,
    "sura_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "page" INTEGER NOT NULL,
    "sajda" "Sajda" NOT NULL,
    "is_book" BOOLEAN NOT NULL,
    "juzu" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sura" (
    "id" SERIAL NOT NULL,
    "sura_number" INTEGER NOT NULL,
    "sura_name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookItems" (
    "id" SERIAL NOT NULL,
    "book_item_id" INTEGER,
    "book_name" TEXT NOT NULL,
    "book_content" TEXT,
    "index_name" TEXT,
    "book_type" "BookType" NOT NULL,
    "is_title" BOOLEAN NOT NULL DEFAULT false,
    "page" INTEGER NOT NULL DEFAULT 0,
    "juzu" INTEGER NOT NULL DEFAULT 0,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Noveler" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT 0,
    "birth_day" TIMESTAMP(3),
    "death_day" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Noveler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookItemsToNoveler" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Token_code_key" ON "Token"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Sura_sura_number_key" ON "Sura"("sura_number");

-- CreateIndex
CREATE UNIQUE INDEX "Sura_sura_name_key" ON "Sura"("sura_name");

-- CreateIndex
CREATE UNIQUE INDEX "Noveler_id_key" ON "Noveler"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Noveler_name_key" ON "Noveler"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BookItemsToNoveler_AB_unique" ON "_BookItemsToNoveler"("A", "B");

-- CreateIndex
CREATE INDEX "_BookItemsToNoveler_B_index" ON "_BookItemsToNoveler"("B");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayah" ADD CONSTRAINT "Ayah_sura_id_fkey" FOREIGN KEY ("sura_id") REFERENCES "Sura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookItems" ADD CONSTRAINT "BookItems_book_item_id_fkey" FOREIGN KEY ("book_item_id") REFERENCES "BookItems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookItemsToNoveler" ADD CONSTRAINT "_BookItemsToNoveler_A_fkey" FOREIGN KEY ("A") REFERENCES "BookItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookItemsToNoveler" ADD CONSTRAINT "_BookItemsToNoveler_B_fkey" FOREIGN KEY ("B") REFERENCES "Noveler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
