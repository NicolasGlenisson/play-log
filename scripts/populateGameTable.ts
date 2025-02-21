import axios from "axios";
import { Game, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

// Get Twitch OAuth token
async function getAccessToken(): Promise<string> {
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
}

async function fetchGames() {
  try {
    const ACCESS_TOKEN = await getAccessToken();

    const IGDB_URL = "https://api.igdb.com/v4/games";

    const step = 500;
    let start = 0;

    while (start < 5000) {
      console.log(`Fetching IGDB games... (offset: ${start})`);

      const response = await axios.post(
        IGDB_URL,
        `fields name, slug, summary, first_release_date, rating;
         sort rating desc;
         limit ${step};
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
      console.log(`${games.length} games retrieved from IGDB.`);

      if (games.length === 0) break; // Stop if no more games

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
        }));

      if (gameData.length > 0) {
        // Insert in a single query
        await prisma.game.createMany({
          data: gameData,
          skipDuplicates: true, // Avoid errors if games already exist
        });

        console.log(`${gameData.length} games inserted into the database.`);
      }

      start += step; // Increase offset

      // Avoid API rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("All games have been successfully added!");
  } catch (error) {
    console.error("Error retrieving games:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute script
fetchGames();
