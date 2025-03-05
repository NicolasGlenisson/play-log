-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "Mode" TEXT[],
ADD COLUMN     "platform" TEXT[],
ADD COLUMN     "rating" DECIMAL(65,30),
ADD COLUMN     "timeToBeat" INTEGER;

-- CreateTable
CREATE TABLE "GameGenre" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GameGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameToGameGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToGameGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameGenre_slug_key" ON "GameGenre"("slug");

-- CreateIndex
CREATE INDEX "_GameToGameGenre_B_index" ON "_GameToGameGenre"("B");

-- AddForeignKey
ALTER TABLE "_GameToGameGenre" ADD CONSTRAINT "_GameToGameGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToGameGenre" ADD CONSTRAINT "_GameToGameGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "GameGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
