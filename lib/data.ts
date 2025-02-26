import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

const ITEMS_PER_PAGE = 6;
// fetch userGames
export async function fetchUserGames(
  userId: number,
  currentPage: number,
  filter: { liked: boolean; finished: boolean; addedToTodo: boolean }
) {
  let whereConditions: Prisma.UserGameWhereInput = {
    userId: userId,
  };

  if (filter.liked) {
    whereConditions = { ...whereConditions, liked: true };
  }
  if (filter.finished) {
    whereConditions = { ...whereConditions, finished: true };
  }
  if (filter.addedToTodo) {
    whereConditions = { ...whereConditions, addedToTodo: true };
  }
  try {
    const userGames = await prisma.userGame.findMany({
      where: whereConditions,
      include: {
        game: true,
      },
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
    });
    const count = await prisma.userGame.count({
      where: whereConditions,
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return { userGames, totalPages };
  } catch (error) {
    throw error;
  }
}

export async function fetchPlaylistsByUserId(userId: number) {
  try {
    const playlists = await prisma.playList.findMany({
      where: {
        userId: userId,
      },
      include: {
        PlayListGames: true,
        user: true,
      },
    });
    return {
      message: "Playlists fetched successfully",
      success: true,
      data: playlists,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Cannot fetch playlists",
      success: false,
      data: [],
    };
  }
}

export async function fetchPlayList(id: number) {
  try {
    const playlist = await prisma.playList.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        PlayListGames: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
            Game: true,
          },
        },
      },
    });
    return playlist;
  } catch (error) {
    throw error;
  }
}
