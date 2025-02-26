"use server";

import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/schemas/signUpSchema";
import { playListSchema } from "@/lib/schemas/playListSchema";
import { UserGame } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { options } from "./auth";
import { getServerSession } from "next-auth";
import { suggestionType } from "@/components/searchBar";
import { fetchPlayList } from "./data";

export type FormState = {
  message: string;
  success: boolean;
};

// Sign up form action
export async function onSubmitSignUpAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);

  // Validate form data with zod
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      success: false,
    };
  }

  // Check if a user with the same email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return {
      message: "User with this email already exists",
      success: false,
    };
  }

  // Try to create the user
  try {
    const newUser = {
      email: parsed.data.email,
      name: parsed.data.username,
      password: bcrypt.hashSync(parsed.data.password, 10),
    };

    await prisma.user.create({
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Cannot create user",
      success: false,
    };
  }
  redirect("/");
}

export async function createPlaylist(
  data: FormData,
  sortableGames: suggestionType[]
) {
  const session = await getServerSession(options);

  if (!session?.user.id) {
    return {
      message: "Missing session",
      success: false,
    };
  }
  const userId = session.user.id;
  const formData = Object.fromEntries(data);

  // Validate form data with zod
  const parsed = playListSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      success: false,
    };
  }

  // Transform tags from string to array of strings
  const tags = parsed.data.tags
    ? parsed.data.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase()) // Remove white spaces and convert to lowercase
        .filter((tag) => tag.length > 2) // Remove too short values
    : [];

  // Games
  const playListGames = sortableGames.map((game, index) => ({
    gameId: game.id,
    position: index,
  }));

  // Try to create the playlist
  let redirectUrl = "/";
  try {
    const newPlayList = await prisma.playList.create({
      data: {
        userId: userId,
        name: parsed.data.name,
        description: parsed.data.description,
        tags: tags,
        PlayListGames: {
          create: playListGames,
        },
      },
    });
    redirectUrl = `/playlist/${newPlayList.id}`;
  } catch (error) {
    console.log(error);
    return {
      message: "Cannot create playlist",
      success: false,
    };
  }

  redirect(redirectUrl);
}

export async function updatePlaylist(
  playlistId: number,
  data: FormData,
  sortableGames: suggestionType[]
) {
  const session = await getServerSession(options);

  if (!session?.user.id) {
    return {
      message: "Missing session",
      success: false,
    };
  }
  const userId = session.user.id;

  // Check that user is playlist owner
  const playlist = await fetchPlayList(playlistId);
  if (userId !== playlist?.user.id) {
    return {
      message: "User isn't playlist owner",
      success: false,
    };
  }

  const formData = Object.fromEntries(data);

  // Validate form data with zod
  const parsed = playListSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      success: false,
    };
  }

  // Transform tags from string to array of strings
  const tags = parsed.data.tags
    ? parsed.data.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase()) // Remove white spaces and convert to lowercase
        .filter((tag) => tag.length > 2) // Remove too short values
    : [];

  // Games

  const playListGames = sortableGames.map((game, index) => ({
    gameId: game.id,
    position: index,
  }));

  // Try to update the playlist
  try {
    await prisma.$transaction([
      prisma.playListGames.deleteMany({
        where: {
          playListId: playlistId,
        },
      }),
      prisma.playList.update({
        where: {
          id: playlistId,
        },
        data: {
          name: parsed.data.name,
          description: parsed.data.description,
          tags: tags,
          PlayListGames: {
            create: playListGames,
          },
        },
      }),
    ]);
  } catch (error) {
    console.log(error);
    return {
      message: "Cannot update playlist",
      success: false,
    };
  }

  redirect(`/playlist/${playlistId}`);
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
}
