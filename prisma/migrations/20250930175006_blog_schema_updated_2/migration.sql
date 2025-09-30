/*
  Warnings:

  - Made the column `slug` on table `blogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "slug" SET NOT NULL;
