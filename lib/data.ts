import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

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

const ITEMS_PER_PAGE = 15;
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

export async function searchPlaylists(page: number, search: string) {
  // Validate the search term
  const searchSchema = z.string().max(100);
  const parsedSearch = searchSchema.safeParse(search);
  if (!parsedSearch.success) {
    throw new Error("Invalid search term");
  }
  const safeSearch = parsedSearch.data;
  // Split the search term into individual words for tags
  const searchWords = safeSearch.split(",").map((word) => word.trim());

  // Create conditions for searching in name and tags
  const whereConditions: Prisma.PlayListWhereInput = {
    OR: [
      { name: { contains: safeSearch, mode: "insensitive" } },
      { tags: { hasSome: searchWords } },
    ],
  };

  try {
    const playlists = await prisma.playList.findMany({
      where: whereConditions,
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
      include: {
        PlayListGames: true,
        user: true,
      },
    });

    const count = await prisma.playList.count({
      where: whereConditions,
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return { playlists, totalPages };
  } catch (error) {
    throw error;
  }
}
