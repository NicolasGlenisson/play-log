import { Badge } from "@/components/ui/badge";
import { fetchPlayList } from "@/lib/playlist";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/lib/auth";
import { Button } from "@/components/custom/buttons";
import React from "react";
import { DeleteButton } from "@/components/playlist/actionButton";
import { Calendar, List, Tag, User, Edit, Gamepad } from "lucide-react";
import GameImage from "@/components/game/gameImage";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const playlist = await fetchPlayList(Number(params.id));

  if (!playlist) {
    notFound();
  }

  const session = await getServerSession(options);
  let editButton: React.ReactNode;
  let deleteButton: React.ReactNode;

  if (session?.user.id && playlist.userId === session.user.id) {
    editButton = (
      <Link href={`/playlist/${playlist.id}/edit`}>
        <Button variant="secondary" size="sm">
          <span className="flex items-center">
            <Edit size={16} className="mr-2" />
            Edit
          </span>
        </Button>
      </Link>
    );

    deleteButton = <DeleteButton id={playlist.id} />;
  }

  // Format date
  const formattedCreationDate = new Date(
    playlist.dateCreation
  ).toLocaleDateString();

  return (
    <div className="w-full max-w-4xl">
      {/* Hero section with gradient background */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CCD5AE] to-[#FAEDCD]"></div>

        {/* Playlist title overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-[#5C6246] p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 drop-shadow-sm">
            {playlist.name}
          </h1>
          <div className="flex items-center gap-2 bg-[#949F6E]/30 px-4 py-1 rounded-full backdrop-blur-sm">
            <List size={18} className="text-[#5C6246]" />
            <span className="text-[#5C6246]">
              {playlist.playListGames.length} games
            </span>
          </div>
        </div>
      </div>

      {/* Main content card */}
      <div className="bg-[#FDFAE0] rounded-3xl shadow-lg p-8 relative z-10 -mt-10 mx-4 border border-[#E9EDCA]">
        {/* Action buttons */}
        <div className="flex justify-end gap-3 mb-6">
          {editButton}
          {deleteButton && <div className="ml-2">{deleteButton}</div>}
        </div>

        {/* Playlist details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column with metadata */}
          <div className="md:col-span-1">
            {/* Metadata card */}
            <div className="bg-[#FAEDCD]/60 rounded-2xl p-6 border border-[#CCD5AE]/50">
              <h2 className="text-xl font-bold text-[#5C6246] mb-4">Details</h2>

              <div className="space-y-4">
                {/* Author */}
                <div className="flex items-start gap-3">
                  <User className="text-[#949F6E] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#5C6246]">Creator</h3>
                    <p className="mt-1 text-[#6B705C]">
                      {playlist.user.name || "Anonymous"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-[#949F6E] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#5C6246]">Created</h3>
                    <p className="mt-1 text-[#6B705C]">
                      {formattedCreationDate}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {playlist.tags && playlist.tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="text-[#949F6E] mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#5C6246]">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {playlist.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-[#E9EDCA] text-[#5C6246] hover:bg-[#CCD5AE] border border-[#CCD5AE]/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column with description and games */}
          <div className="md:col-span-2">
            {/* Description section */}
            {playlist.description && (
              <div className="bg-[#FAEDCD]/60 rounded-2xl p-6 mb-6 border border-[#CCD5AE]/50">
                <h2 className="text-xl font-bold text-[#5C6246] mb-3">
                  About this playlist
                </h2>
                <p className="text-[#6B705C] leading-relaxed">
                  {playlist.description}
                </p>
              </div>
            )}

            {/* Games list */}
            <div className="bg-[#E9EDCA]/70 rounded-2xl p-6 border border-[#CCD5AE]/60">
              <div className="flex items-center gap-2 mb-4">
                <Gamepad className="text-[#866C47]" />
                <h2 className="text-xl font-bold text-[#5C6246]">
                  Games in playlist
                </h2>
              </div>

              <div className="space-y-4">
                {playlist.playListGames.map((playlistGame, index) => (
                  <div key={playlistGame.id} className="group">
                    <Link href={`/game/${playlistGame.game.slug}`}>
                      <div className="flex items-center p-3 rounded-xl transition-colors hover:bg-[#CCD5AE]/30">
                        <span className="flex items-center justify-center w-8 h-8 bg-[#949F6E] text-white rounded-full font-medium mr-3">
                          {playlistGame.position + 1}
                        </span>

                        <div className="flex-grow flex items-center">
                          {playlistGame.game.imageId ? (
                            <div className="w-12 h-12 mr-3 rounded-md overflow-hidden">
                              <GameImage
                                imageId={playlistGame.game.imageId}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 mr-3 rounded-md bg-gradient-to-br from-[#CCD5AE] to-[#FAEDCD] flex items-center justify-center">
                              <span className="text-lg">🎮</span>
                            </div>
                          )}

                          <span className="font-medium text-[#5C6246] group-hover:text-[#3A3F29]">
                            {playlistGame.game.name}
                          </span>
                        </div>

                        {/* Arrow link */}
                        <svg
                          className="w-5 h-5 text-[#949F6E] opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>

                    {index < playlist.playListGames.length - 1 && (
                      <div className="border-t border-[#CCD5AE]/50 my-3 mx-12" />
                    )}
                  </div>
                ))}

                {playlist.playListGames.length === 0 && (
                  <p className="italic text-[#949F6E]/80 text-center py-6">
                    This playlist is empty.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
