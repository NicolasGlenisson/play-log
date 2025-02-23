import prisma from "@/lib/prisma";

// Fetch game by slug
export async function fetchGame(slug: string) {
  try {
    const game = await prisma.game.findUnique({
      where: {
        slug: slug,
      },
    });

    return game;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch game");
  }
}

// fetch userGame relation
export async function fetchUserGame(userId: number, gameId: number) {
  try {
    const userGame = await prisma.userGame.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: gameId,
        },
      },
    });

    return userGame;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user game");
  }
}

// fetch userGames
export async function fetchUserGames(userId: number) {
  try {
    const userGames = await prisma.userGame.findMany({
      where: {
        userId: userId,
      },
      include: {
        game: true,
      },
    });

    return userGames;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user games");
  }
}
