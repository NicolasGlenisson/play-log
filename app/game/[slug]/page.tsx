import { Badge } from "@/components/ui/badge";
import { fetchGame, fetchUserGame } from "@/lib/game";
import { options } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import GameImage from "@/components/game/gameImage";
import { ActionButton } from "@/components/game/actionButton";
import { CalendarDays, Award, Clock, Tag, Users, Gamepad } from "lucide-react";

// Page to display game with few details and actions (finish, like, add to list)
export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(options);
  const params = await props.params;
  const slug = params.slug;

  const game = await fetchGame(slug);
  if (!game) {
    notFound();
  }

  let userGame = null;
  if (session?.user.id) {
    userGame = await fetchUserGame(session.user.id, game.id);
  }

  // Format date
  const formattedReleaseDate = game.releaseDate
    ? new Date(game.releaseDate).toLocaleDateString()
    : "";
  // genre placeholder
  const genres = ["Action", "Adventure", "RPG", "Indie", "Simulation"];
  return (
    <div className="w-full max-w-4xl">
      {/* Hero section with image background */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8">
        {game.imageId ? (
          <div className="absolute inset-0">
            <GameImage
              imageId={game.imageId}
              className="w-full h-full object-cover filter blur-sm opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#949F6E] to-[#FAEDCD]/70"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#CCD5AE] to-[#FAEDCD]"></div>
        )}

        {/* Game title overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 drop-shadow-lg">
            {game.name}
          </h1>
          {formattedReleaseDate && (
            <div className="flex items-center gap-2 text-white/90 bg-[#949F6E]/60 px-4 py-1 rounded-full backdrop-blur-sm">
              <CalendarDays size={18} />
              <span>{formattedReleaseDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content card */}
      <div className="bg-[#FDFAE0] rounded-3xl shadow-lg p-8 relative z-10 -mt-16 mx-4 border border-[#E9EDCA]">
        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 mt-2">
          <ActionButton
            type="like"
            gameSlug={slug}
            userId={session?.user.id}
            userGame={userGame}
          />
          <ActionButton
            type="finish"
            gameSlug={slug}
            userId={session?.user.id}
            userGame={userGame}
          />
          <ActionButton
            type="todo"
            gameSlug={slug}
            userId={session?.user.id}
            userGame={userGame}
          />
        </div>

        {/* Game details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column with image */}
          <div className="md:col-span-1">
            {game.imageId ? (
              <div className="rounded-2xl overflow-hidden border-4 border-[#E9EDCA] shadow-lg transform rotate-1">
                <GameImage
                  imageId={game.imageId}
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl aspect-[3/4] bg-gradient-to-br from-[#CCD5AE] to-[#FAEDCD] flex items-center justify-center transform rotate-1">
                <span className="text-4xl">🎮</span>
              </div>
            )}

            {/* Metadata with icons */}
            <div className="mt-6 space-y-4">
              {genres && genres.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="text-[#949F6E] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#5C6246]">Genres</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {genres.map((genre) => (
                        <Badge
                          key={genre}
                          className="bg-[#E9EDCA] text-[#5C6246] hover:bg-[#CCD5AE] border border-[#CCD5AE]/50"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional metadata item */}
              <div className="flex items-start gap-3">
                <Users className="text-[#949F6E] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#5C6246]">Players</h3>
                  <p className="mt-1 text-[#6B705C]">Single Player</p>
                </div>
              </div>

              {/* Additional metadata item */}
              <div className="flex items-start gap-3">
                <Gamepad className="text-[#949F6E] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#5C6246]">Platform</h3>
                  <p className="mt-1 text-[#6B705C]">PC, PlayStation, Xbox</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column with description */}
          <div className="md:col-span-2">
            <div className="bg-[#FAEDCD]/60 rounded-2xl p-6 mb-6 border border-[#CCD5AE]/50">
              <h2 className="text-2xl font-bold text-[#5C6246] mb-4">
                About this game
              </h2>
              {game.summary ? (
                <p className="text-[#6B705C] leading-relaxed">{game.summary}</p>
              ) : (
                <p className="italic text-[#949F6E]/80">
                  No description available
                </p>
              )}
            </div>

            {/* Additional sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#E9EDCA]/70 rounded-2xl p-5 border border-[#CCD5AE]/60">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="text-[#866C47]" />
                  <h3 className="font-semibold text-[#5C6246]">
                    Critics Score
                  </h3>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-[#866C47]">
                    {"10"}
                  </span>
                  <span className="text-[#866C47] text-lg">/100</span>
                </div>
              </div>

              <div className="bg-[#E9EDCA]/70 rounded-2xl p-5 border border-[#CCD5AE]/60">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-[#866C47]" />
                  <h3 className="font-semibold text-[#5C6246]">Play Time</h3>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-[#866C47]">
                    {/* todo: placeholder */}
                    {"?"}
                  </span>
                  <span className="text-[#866C47] text-lg"> hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const slug = params.slug;
  const game = await fetchGame(slug);

  if (!game) {
    return {};
  }
  return {
    title: game.name,
    description: game.summary || "Learn more about this game",
    openGraph: {
      title: game.name,
      description: game.summary,
      images: [
        {
          url: `https://images.igdb.com/igdb/image/upload/t_720/${game.imageId}.jpg`,
          alt: "Game cover image",
        },
      ],
    },
  };
}
