-- AlterTable
ALTER TABLE "public"."blogs" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "password" DROP NOT NULL;
