import PlayListForm from "@/components/form/playListForm";
import { options } from "@/lib/auth";
import { fetchPlayList } from "@/lib/data";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

// Page to edit a playlist
export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const session = await getServerSession(options);
  // Check session
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/playlist/mine");
  }

  // Check if user is owner of the playlist
  const playlist = await fetchPlayList(Number(params.id));
  if (!playlist || playlist.userId !== session.user.id) {
    notFound();
  }

  return <PlayListForm playlist={playlist} type="edit" />;
}
