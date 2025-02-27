import { Badge } from "@/components/ui/badge";
import { fetchPlayList } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;

  const playlist = await fetchPlayList(Number(params.id));

  if (!playlist) {
    notFound();
  }

  const session = await getServerSession(options);
  let editButton;
  if (session?.user.id && playlist.userId === session.user.id) {
    editButton = (
      <Link href={`/playlist/${playlist.id}/edit`}>
        <Button>Edit</Button>
      </Link>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 relative">
        {editButton && (
          <div className="absolute top-4 right-4">{editButton}</div>
        )}
        <h1 className="text-2xl font-bold mb-4">{playlist.name}</h1>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Author:</span> {playlist.user.name}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Created:</span>{" "}
          {new Date(playlist.dateCreation).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Description:</span>{" "}
          {playlist.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {playlist.tags.map((tag, index) => (
            <Badge variant="secondary" key={index}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-4 mt-8">
          <h2>Games</h2>
          {playlist.PlayListGames.map((playlistGame, index) => (
            <div key={playlistGame.id} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">{index + 1}.</span>
                <Link href={`/game/${playlistGame.Game.slug}`}>
                  {playlistGame.Game.name}
                </Link>
              </div>
              {index < playlist.PlayListGames.length - 1 && (
                <hr className="border-t border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
