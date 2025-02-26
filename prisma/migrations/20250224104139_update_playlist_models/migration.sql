-- CreateTable
CREATE TABLE "PlayList" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayListGames" (
    "id" SERIAL NOT NULL,
    "playListId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "PlayListGames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayList_tags_idx" ON "PlayList" USING GIN ("tags" array_ops);

-- CreateIndex
CREATE INDEX "PlayList_userId_idx" ON "PlayList"("userId");

-- CreateIndex
CREATE INDEX "PlayList_name_idx" ON "PlayList"("name");

-- CreateIndex
CREATE INDEX "PlayListGames_playListId_idx" ON "PlayListGames"("playListId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayListGames_position_playListId_key" ON "PlayListGames"("position", "playListId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayListGames_playListId_gameId_key" ON "PlayListGames"("playListId", "gameId");

-- AddForeignKey
ALTER TABLE "PlayList" ADD CONSTRAINT "PlayList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayListGames" ADD CONSTRAINT "PlayListGames_playListId_fkey" FOREIGN KEY ("playListId") REFERENCES "PlayList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayListGames" ADD CONSTRAINT "PlayListGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
