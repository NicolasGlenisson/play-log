"use client";

import PlayListCard, { PlayListType } from "@/components/playlist/playlistCard";

interface playListCollectionProps {
  playlists: PlayListType[];
  canCreate?: boolean;
}

export default function PlayListCollection({
  playlists,
  canCreate = false,
}: playListCollectionProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8 p-6">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="w-full sm:w-auto flex justify-center">
          <PlayListCard playlist={playlist} />
        </div>
      ))}

      {playlists.length === 0 && !canCreate && (
        <div className="w-full py-12 flex flex-col items-center justify-center p-12 bg-[#FAEDCD]/50 rounded-xl border border-[#E9EDCA]/80">
          <div className="text-[#C9B98B] mb-3 text-5xl">🎮</div>
          <h3 className="text xl font-medium text-[#6B5E40] mb-2">
            No playlists
          </h3>
          <p className="text-[#7A6C48] text-center max-w-md">
            {"There's no playlist to display"}
          </p>
        </div>
      )}
    </div>
  );
}
