import GameTable from "@/components/gameTable";
import { options } from "@/lib/auth";
import { fetchUserGames } from "@/lib/data";
import { getServerSession } from "next-auth";
import Pagination from "@/components/pagination";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    liked?: string;
    finished?: string;
    addedToTodo?: string;
  }>;
}) {
  const session = await getServerSession(options);

  if (!session?.user.id) {
    return; //TODO 404
  }

  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams?.page) || 1;

  const filter = {
    liked: searchParams?.liked === "true",
    finished: searchParams?.finished === "true",
    addedToTodo: searchParams?.addedToTodo === "true",
  };

  const { userGames, totalPages } = await fetchUserGames(
    session.user.id,
    currentPage,
    filter
  );

  return (
    <>
      <GameTable userGames={userGames} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        currentUrl="/myGames?"
      />
    </>
  );
}
