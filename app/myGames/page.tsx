import GameTable from "@/components/game/gameTable";
import { options } from "@/lib/auth";
import { fetchUserGames } from "@/lib/game";
import { getServerSession } from "next-auth";
import Pagination from "@/components/custom/pagination";
import { redirect } from "next/navigation";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    liked?: string;
    finished?: string;
    addedToTodo?: string;
    sort?: "asc" | "desc";
  }>;
}) {
  const session = await getServerSession(options);

  if (!session?.user.id) {
    redirect("/api/auth/signin?callbackUrl=/myGames");
  }

  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams?.page) || 1;

  const filter = {
    liked: searchParams?.liked === "true",
    sort: searchParams?.sort || "asc",
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
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}
