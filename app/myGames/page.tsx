import GameTable from "@/components/gameTable";
import { options } from "@/lib/auth";
import { fetchUserGames } from "@/lib/data";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(options);
  console.log(session);
  if (!session?.user.id) {
    return; //TODO 404
  }
  const userGames = await fetchUserGames(session.user.id);
  return <GameTable userGames={userGames} />;
}
