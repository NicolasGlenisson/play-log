/*
  Warnings:

  - You are about to drop the column `timeToBeat` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "timeToBeat",
ADD COLUMN     "ratingCount" INTEGER;
