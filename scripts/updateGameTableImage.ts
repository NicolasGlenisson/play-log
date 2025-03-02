import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { getAccessToken } from "@/lib/actionIGDB";

const prisma = new PrismaClient();

async function fetchGames() {
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

      // Fetch games without images
      const games = await prisma.game.findMany({
        select: { id: true },
        where: { imageId: null },
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

      const response = await axios.post(
        IGDB_URL,
        `fields cover.image_id;
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

      const fetchedGames = response.data;

      if (!Array.isArray(fetchedGames) || fetchedGames.length === 0) {
        console.warn("No valid data returned from IGDB.");
        continue;
      }

      console.log(`Updating ${fetchedGames.length} games in the database...`);

      // Update games
      await prisma.$transaction(
        fetchedGames
          .filter((game: any) => game.cover?.image_id) // Only if has a cover id
          .map((game: any) =>
            prisma.game.update({
              where: { id: game.id },
              data: { imageId: game.cover.image_id },
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

fetchGames();
