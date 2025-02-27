import { CardGrid } from "@/components/cardCollection";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/searchBar";
import { fetchGames } from "@/lib/actionIGDB";

export default async function Page(props: {
  searchParams?: Promise<{
    name?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams?.page) || 1;

  const games = await fetchGames(searchParams?.name || "", currentPage);

  // Transform to a table form CardGrid component
  const cards = games.map((game) => {
    return {
      id: game.id,
      title: game.name,
      date: game.releaseDate
        ? new Date(game.releaseDate).toLocaleDateString()
        : "",
      description: game.summary || "",
      url: `/game/${game.slug}`,
    };
  });
  return (
    <>
      <SearchBar defaultValue={searchParams?.name} />
      <CardGrid cards={cards} />
      {/* only display pagination if at least 10 result */}
      {cards.length === 10 && <Pagination currentPage={currentPage} />}
    </>
  );
}
