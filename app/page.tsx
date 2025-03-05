import SearchBar from "@/components/searchBar";
import GameCarousel from "@/components/game/gameCarousel";
import PlaylistCarousel from "@/components/playlist/playlistCarousel";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { Gamepad2, List } from "lucide-react";
import { Button } from "@/components/custom/buttons";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/lib/auth";

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
        imageId: true,
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
  const [games, playlists, session] = await Promise.all([
    getRandomGames(),
    getRandomPlaylists(),
    getServerSession(options),
  ]);

  return (
    <div className="space-y-8 md:space-y-16 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#CCD5AE]/40 to-[#FAEDCD]/60 p-1 sm:p-4 md:p-8 lg:p-12 rounded-2xl md:rounded-3xl shadow-sm mx-2 md:mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#6B5E40] mb-3 md:mb-4">
            Track Your Gaming Journey
          </h1>
          <p className="text-[#7A6C48] text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
            Discover, organize, and share your favorite games with the community
          </p>
          <div className="max-w-lg mx-auto">
            <SearchBar />
          </div>
        </div>
        <div className="absolute -bottom-3 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-[#FDFAE0]/80"></div>
      </div>

      {/* Game Section */}
      <section className="px-1 sm:px-2 md:px-4">
        <div className="flex items-center mb-4 md:mb-6">
          <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#9B7E55]" />
          <h2 className="text-xl md:text-2xl font-bold text-[#6B5E40]">
            Explore Games
          </h2>
        </div>
        <div className="bg-[#FAEDCD]/50 p-3 md:p-6 rounded-xl md:rounded-2xl border border-[#E9DCC3]/70">
          <GameCarousel games={games} />
        </div>
      </section>

      {/* Playlist Section */}
      <section className="px-2 md:px-4">
        <div className="flex items-center mb-4 md:mb-6">
          <List className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#9B7E55]" />
          <h2 className="text-xl md:text-2xl font-bold text-[#6B5E40]">
            Community Playlists
          </h2>
        </div>
        <div className="bg-[#FAEDCD]/50 p-3 md:p-6 rounded-xl md:rounded-2xl border border-[#E9DCC3]/70">
          <PlaylistCarousel playlists={playlists} />
        </div>
      </section>

      {/* Call to Action */}
      {!session && (
        <section className="px-2 md:px-4">
          <div className="bg-gradient-to-r from-[#F8E8B8]/70 to-[#E9DCC3]/70 p-4 md:p-8 rounded-xl md:rounded-2xl text-center border border-[#E9DCC3]">
            <h2 className="text-xl md:text-2xl font-bold text-[#5E5034] mb-2 md:mb-3">
              Create Your Game Collection
            </h2>
            <p className="text-[#7A6C48] mb-4 md:mb-6 max-w-lg mx-auto text-sm md:text-base">
              Sign up to track your progress, create lists, and join the gaming
              community
            </p>
            <Link href="/api/auth/signin">
              <Button
                variant="primary"
                size="lg"
                className="inline-flex items-center font-medium text-sm md:text-base"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
