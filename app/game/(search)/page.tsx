import { CardGrid } from "@/components/custom/cardCollection";
import Pagination from "@/components/custom/pagination";
import SearchBar from "@/components/searchBar";
import { fetchGames } from "@/lib/actionIGDB";
import { ActionButton } from "@/components/game/actionButton";
import { getServerSession } from "next-auth";
import { options } from "@/lib/auth";
import { fetchUserGame } from "@/lib/game";
import Link from "next/link";
import { unstable_cache } from "next/cache";

// Use cache to avoid requesting many times api for same search
const getGames = unstable_cache(async (name, page) => {
  return await fetchGames(name, page);
});

export default async function Page(props: {
  searchParams?: Promise<{
    name?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(options);
  const currentPage = Number(searchParams?.page) || 1;

  const games = await getGames(searchParams?.name || "", currentPage);

  // Transform to a table form CardGrid component
  const cards = await Promise.all(
    games.map(async (game) => {
      const userGame = session?.user.id
        ? await fetchUserGame(session.user.id, game.id)
        : null;

      return {
        id: game.id,
        title: game.name,
        date: game.releaseDate
          ? new Date(game.releaseDate).toLocaleDateString()
          : "",
        description: game.summary || "",
        hover: (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <ActionButton
              type="finish"
              gameSlug={game.slug}
              userId={session?.user.id}
              userGame={userGame}
            />
            <ActionButton
              type="like"
              gameSlug={game.slug}
              userId={session?.user.id}
              userGame={userGame}
            />
            <ActionButton
              type="todo"
              gameSlug={game.slug}
              userId={session?.user.id}
              userGame={userGame}
            />
            <Link href={`/game/${game.slug}`} className="bold underline">
              See More
            </Link>
          </div>
        ),
      };
    })
  );

  return (
    <>
      <SearchBar defaultValue={searchParams?.name} />
      <CardGrid cards={cards} />
      {cards.length >= 10 && <Pagination currentPage={currentPage} />}
    </>
  );
}
