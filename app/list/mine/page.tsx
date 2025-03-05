import { getServerSession } from "next-auth";
import { fetchPlaylistsByUserId } from "@/lib/playlist";
import PlayListCollection from "@/components/playlist/playlistCollection";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/list/mine");
  }

  const req = await fetchPlaylistsByUserId(session.user.id);

  if (!req.success) {
    return <div>Error loading playlists</div>;
  }

  const playlists = req.data;

  return (
    <>
      <h1 className="text-center mb-8 text-3xl md:text-4xl font-bold text-[#5E5034] mt-6">
        My Playlist
      </h1>

      <PlayListCollection playlists={playlists} />
    </>
  );
}
