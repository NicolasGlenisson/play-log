"use client";

import PlayListCard, { PlayListType } from "./playListCard";

interface playListCollectionProps {
  playlists: PlayListType[];
}
export default function PlayListCollection(props: playListCollectionProps) {
  const { playlists } = props;

  return (
    <div className="flex flex-wrap gap-4 justify-left p-3">
      {playlists.map((playlist) => (
        <PlayListCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}
