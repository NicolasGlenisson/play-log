-- DropForeignKey
ALTER TABLE "PlayListGames" DROP CONSTRAINT "PlayListGames_gameId_fkey";

-- DropForeignKey
ALTER TABLE "PlayListGames" DROP CONSTRAINT "PlayListGames_playListId_fkey";

-- AddForeignKey
ALTER TABLE "PlayListGames" ADD CONSTRAINT "PlayListGames_playListId_fkey" FOREIGN KEY ("playListId") REFERENCES "PlayList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayListGames" ADD CONSTRAINT "PlayListGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
