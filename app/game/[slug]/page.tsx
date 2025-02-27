import { fetchGame, fetchUserGame } from "@/lib/data";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { options } from "@/lib/auth";
import { ActionButton } from "@/components/actionButton";

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
  if (session?.user) {
    userGame = await fetchUserGame(session.user.id, game.id);
  }

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg mt-10">
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
          Release date : {new Date(game.releaseDate).toLocaleDateString()}
        </p>
      )}
      {game.summary && (
        <p className="text-left text-gray-800">{game.summary}</p>
      )}
    </div>
  );
}
