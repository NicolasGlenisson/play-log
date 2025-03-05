import axios from "axios";
import { prisma } from "@/lib/prisma";
import { Game } from "@prisma/client";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
let token: string | null = null;
let expiresAt: number | null = null;
// Get Twitch OAuth token
export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (token && expiresAt && now < expiresAt) {
    return token;
  }
  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      }
    );

    console.log("OAuth token successfully retrieved.");

    // Keep token to avoid requesting it everytime
    token = response.data.access_token;
    expiresAt = now + response.data.expires_in - 10;
    return response.data.access_token;
  } catch (error) {
    console.error("Error retrieving OAuth token:", error);
    process.exit(1);
  }
}

// Type for games from IGDB API
interface GameIGDB {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  first_release_date?: number; // UNIX timestamp (seconds)
  genres?: { id: number }[];
  platforms?: { name: string }[];
  total_rating?: number;
  total_rating_count?: number;
  cover: { image_id: string };
}
const ITEMS_PER_PAGE = 10;

export async function fetchGames(name: string, page: number) {
  // Only search if query is longer than 3 char
  if (name.length < 3) {
    return [];
  }
  try {
    const ACCESS_TOKEN = await getAccessToken();

    const IGDB_URL = "https://api.igdb.com/v4/games";

    const start = (page - 1) * ITEMS_PER_PAGE;

    const response = await axios.post(
      IGDB_URL,
      `fields name, slug, summary, first_release_date, rating, platforms.*, genres.*, total_rating, game_modes.*, total_rating_count, cover.image_id;
        where name ~ *"${name}"*;
        sort rating desc;
        limit ${ITEMS_PER_PAGE};
        offset ${start};`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    const games = response.data;

    // Game ids so we can fetch them after inserting in our database
    const gameIds = games.map((game: { id: number }) => game.id);

    // Transform data for Prisma and avoid nulls
    const gameData = games
      .filter((game: GameIGDB) => game.id && game.name) // Filter valid games
      .map((game: GameIGDB) => ({
        id: game.id, // Use IGDB ID
        name: game.name,
        slug: game.slug,
        summary: game.summary || null,
        releaseDate: game.first_release_date
          ? new Date(game.first_release_date * 1000)
          : null,
        genre: {
          connect: game.genres?.map((genre: { id: number }) => {
            return {
              id: genre.id,
            };
          }),
        },
        platform: game.platforms?.map(
          (platform: { name: string }) => platform.name
        ),
        rating: game.total_rating,
        ratingCount: game.total_rating_count,
        imageId: game.cover?.image_id,
      }));

    if (gameData.length > 0) {
      // Insert in a single query
      await prisma.$transaction(
        gameData.map((game: Game) => {
          const { id, ...gameToUpsert } = game;
          return prisma.game.upsert({
            where: { id: id },
            create: game,
            update: gameToUpsert,
          });
        })
      );

      const fetchedGames = await prisma.game.findMany({
        where: { id: { in: gameIds } },
      });

      return fetchedGames;
    }
    console.log("end");
    return [];
  } catch (error) {
    console.error("Error retrieving games:", error);
    return [];
  }
}
