"use server";

import { prisma } from "@/lib/prisma";
import { playListSchema } from "@/lib/schemas/playListSchema";
import { redirect } from "next/navigation";
import { options } from "./auth";
import { getServerSession } from "next-auth";
import { suggestionType } from "@/components/searchBar";
import { Prisma } from "@prisma/client";
import { z } from "zod";
const ITEMS_PER_PAGE = 10;

export async function fetchPlaylistsByUserId(userId: number) {
  try {
    const playlists = await prisma.playList.findMany({
      where: {
        userId: userId,
      },
      include: {
        playListGames: true,
        user: true,
      },
    });

    return {
      message: "Playlists fetched successfully",
      success: true,
      data: playlists,
    };
  } catch (error) {
    console.error(error);
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
        playListGames: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
            game: true,
          },
        },
      },
    });
    return playlist;
  } catch (error) {
    console.error(error);
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
        playListGames: true,
        user: true,
      },
    });

    const count = await prisma.playList.count({
      where: whereConditions,
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return { playlists, totalPages };
  } catch (error) {
    console.error(error);
    throw error;
  }
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
        playListGames: {
          create: playListGames,
        },
      },
    });
    redirectUrl = `/playlist/${newPlayList.id}`;
  } catch (error) {
    console.error(error);
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
          playListGames: {
            create: playListGames,
          },
        },
      }),
    ]);
  } catch (error) {
    console.error(error);
    return {
      message: "Cannot update playlist",
      success: false,
    };
  }

  redirect(`/playlist/${playlistId}`);
}

export async function deletePlaylist(id: number) {
  // Check that user is connected and owner of playlist
  const session = await getServerSession(options);
  if (!session?.user.id) {
    throw new Error("Missing session");
  }

  const playlist = await prisma.playList.findUnique({
    where: {
      id: id,
    },
  });
  console.log(playlist);
  if (!playlist) {
    throw new Error("Playlist doesn't exist");
  }

  if (playlist.userId !== session.user.id) {
    throw new Error("User not owner of the playlist");
  }

  // Everything good we can delete the playlist
  await prisma.playList.delete({ where: { id: id } });
  redirect(`/playlist`);
}
