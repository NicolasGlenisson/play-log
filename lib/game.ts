"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UserGame } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { options } from "./auth";
import { getServerSession } from "next-auth";
import { cache } from "react";

// Fetch game by slug
export const fetchGame = cache(async (slug: string) => {
  try {
    const game = await prisma.game.findUnique({
      where: {
        slug: slug,
      },
      include: {
        genre: true,
        _count: {
          select: { userGames: { where: { liked: true } } },
        },
      },
    });

    return game;
  } catch (error) {
    console.error("Failed to fetch game", error);
    throw error;
  }
});

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
    console.error("Failed to fetch user game", error);
    throw error;
  }
}

const ITEMS_PER_PAGE = 15;
// fetch userGames
export async function fetchUserGames(
  userId: number,
  currentPage: number,
  filter: {
    liked: boolean;
    finished: boolean;
    addedToTodo: boolean;
    sort: "asc" | "desc";
  }
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
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        game: {
          name: filter.sort,
        },
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
    console.error("Failed to fetch games", error);
    throw error;
  }
}

export type ActionType = "like" | "finish" | "todo";

export async function gameAction(gameSlug: string, actionType: ActionType) {
  const session = await getServerSession(options);

  if (!session?.user.id) {
    return {
      message: "Missing session",
      success: false,
    };
  }
  const userId = session.user.id;

  try {
    // Get game to get id and check if exists
    const game = await prisma.game.findUnique({
      where: {
        slug: gameSlug,
      },
    });

    if (!game) {
      return {
        message: "Game not found",
        success: false,
      };
    }

    // Get user game relation if exits
    const userGame = await prisma.userGame.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: game.id,
        },
      },
    });

    let keyToUpdate: string;
    switch (actionType) {
      case "like":
        keyToUpdate = "liked";
        break;
      case "finish":
        keyToUpdate = "finished";
        break;
      case "todo":
        keyToUpdate = "addedToTodo";
        break;
    }

    // Create user game relation if not exists
    if (!userGame) {
      await prisma.userGame.create({
        data: {
          userId,
          gameId: game.id,
          [keyToUpdate]: true,
        },
      });
    } else {
      // Else we update it
      const userGameUpdated = await prisma.userGame.update({
        where: {
          userId_gameId: {
            userId: userId,
            gameId: game.id,
          },
        },
        data: {
          // Toggle the value
          [keyToUpdate]: !userGame[keyToUpdate as keyof UserGame],
        },
      });

      // If everything is false we delete the line
      if (
        !userGameUpdated.finished &&
        !userGameUpdated.liked &&
        !userGameUpdated.addedToTodo
      ) {
        await prisma.userGame.delete({
          where: {
            userId_gameId: {
              userId: userId,
              gameId: game.id,
            },
          },
        });
      }
    }

    revalidatePath(`/game/${gameSlug}`);
  } catch (error) {
    console.error("Failed game action", error);
    throw error;
  }

  return {
    message: "Action completed successfully",
    success: true,
  };
}
