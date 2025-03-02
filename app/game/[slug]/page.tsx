import { fetchGame, fetchUserGame } from "@/lib/game";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { options } from "@/lib/auth";
import { ActionButton } from "@/components/game/actionButton";
import GameImage from "@/components/game/gameImage";

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

  const formattedReleaseDate = game.releaseDate
    ? new Date(game.releaseDate).toLocaleDateString()
    : "";

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg mt-10">
      {game.imageId && <GameImage imageId={game.imageId} />}
      <h1 className="text-3xl font-bold text-center mb-6">{game.name}</h1>
      <div className="flex justify-center gap-4 mb-6">
        <ActionButton
          type="finish"
          gameSlug={slug}
          userId={session?.user.id}
          userGame={userGame}
        />
        <ActionButton
          type="like"
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
      {game.releaseDate && (
        <p className="text-left text-gray-600 mb-4">
          Release date : {formattedReleaseDate}
        </p>
      )}
      {game.summary && (
        <p className="text-left text-gray-800">{game.summary}</p>
      )}
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
    description: game.summary || "Découvrez plus d'informations sur ce jeu.",
    openGraph: {
      title: game.name,
      description: game.summary,
    },
  };
}
