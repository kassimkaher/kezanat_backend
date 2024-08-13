-- AlterEnum
ALTER TYPE "BookType" ADD VALUE 'FOOTER';

-- AlterTable
ALTER TABLE "BookItems" ALTER COLUMN "book_name" DROP NOT NULL,
ALTER COLUMN "juzu" SET DEFAULT -1;
