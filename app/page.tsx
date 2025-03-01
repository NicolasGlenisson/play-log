import SearchBar from "@/components/searchBar";
import GameCarousel from "@/components/game/gameCarousel";
import PlaylistCarousel from "@/components/playlist/playlistCarousel";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cache duration in seconds (e.g., 3 hours = 10800 seconds)
const CACHE_DURATION = 10800;

// Cached function to fetch random games
const getRandomGames = unstable_cache(
  async () => {
    const count = await prisma.game.count();
    const randomOffset = Math.floor(Math.random() * (count - 3));
    return await prisma.game.findMany({
      select: {
        id: true,
        name: true,
        summary: true,
        slug: true,
      },
      skip: randomOffset,
      take: 3,
    });
  },
  ["random-games"],
  { revalidate: CACHE_DURATION }
);

// Cached function to fetch random playlists
const getRandomPlaylists = unstable_cache(
  async () => {
    const count = await prisma.playList.count();
    let randomOffset = 0;
    if (count > 3) {
      randomOffset = Math.floor(Math.random() * (count - 3));
    }
    return await prisma.playList.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      skip: randomOffset,
      take: 3,
    });
  },
  ["random-playlists"],
  { revalidate: CACHE_DURATION }
);

export default async function HomePage() {
  const [games, playlists] = await Promise.all([
    getRandomGames(),
    getRandomPlaylists(),
  ]);

  return (
    <div className="space-y-16 w-full">
      <section>
        <h2 className="text-2xl font-bold mb-6 px-4">Find games</h2>
        <SearchBar />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 px-4">Random Games</h2>
        <GameCarousel games={games} />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 px-4">Random Playlists</h2>
        <PlaylistCarousel playlists={playlists} />
      </section>
    </div>
  );
}
