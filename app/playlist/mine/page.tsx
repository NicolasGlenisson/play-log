import { getServerSession } from "next-auth";
import { fetchPlaylistsByUserId } from "@/lib/data";
import PlayListCollection from "@/components/playListCollection";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    notFound();
  }

  const req = await fetchPlaylistsByUserId(session.user.id);

  if (!req.success) {
    return <div>Error loading playlists</div>;
  }

  const playlists = req.data;

  return (
    <>
      <h1>My Playlists</h1>
      <PlayListCollection playlists={playlists} />
    </>
  );
}
