import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { getAccessToken } from "@/lib/actionIGDB";

const prisma = new PrismaClient();
async function fetchGenres() {
  const ACCESS_TOKEN = await getAccessToken();
  const IGDB_URL = "https://api.igdb.com/v4/genres";

  const response = await axios.post(
    IGDB_URL,
    `fields id, slug, name;
    limit 500;`,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    }
  );

  const genres = response.data;

  if (!Array.isArray(genres) || genres.length === 0) {
    console.warn("No valid data returned from IGDB.");
    return;
  }

  console.log(`${genres.length} genres fetched`);
  await prisma.gameGenre.createMany({
    data: genres,
    skipDuplicates: true, // Avoid errors if games already exist
  });
}

async function updateGames() {
  try {
    const ACCESS_TOKEN = await getAccessToken();
    const IGDB_URL = "https://api.igdb.com/v4/games";

    const step = 500;
    let hasGameLeft = true;
    let lastId = 0;

    while (hasGameLeft) {
      console.log(
        `Fetching games with missing images... (batch size: ${step})`
      );

      // Fetch games without data
      const games = await prisma.game.findMany({
        select: { id: true },
        take: step,
        ...(lastId ? { cursor: { id: lastId }, skip: 1 } : {}),
      });

      if (games.length === 0) {
        hasGameLeft = false;
        break;
      }

      // game ids for api request
      const gameIds = games.map((game) => game.id);

      lastId = gameIds[gameIds.length - 1];

      console.log(
        `Querying IGDB for ${gameIds.length} games from id ${lastId} ...`
      );

      // game info
      const responseGame = await axios.post(
        IGDB_URL,
        `fields platforms.*, genres.*, total_rating, game_modes.*, total_rating_count;
        where id = (${gameIds.join(",")});
        limit ${gameIds.length};`,
        {
          headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            Accept: "application/json",
          },
        }
      );

      const fetchedGames = responseGame.data;

      console.log(`Updating ${fetchedGames.length} games in the database...`);

      if (!Array.isArray(fetchedGames) || fetchedGames.length === 0) {
        console.warn("No valid data returned from IGDB.");
        continue;
      }

      // Create updated game record
      const updatedGames = fetchedGames.map((game) => {
        return {
          id: game.id,
          mode: game.game_modes?.map((mode: { name: string }) => mode.name),
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
        };
      });

      // Update games
      await prisma.$transaction(
        updatedGames.map((game: any) =>
          prisma.game.update({
            where: { id: game.id },
            data: game,
          })
        )
      );

      console.log(`Batch completed! Processed ${gameIds.length} games.`);

      // To avoid api ratio
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("✅ All games have been successfully updated!");
  } catch (error) {
    console.error("❌ Error retrieving games:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchGenres();
updateGames();
