"use client";

import { Button } from "@/components/ui/button";
import { deletePlaylist } from "@/lib/playlist";

export function DeleteButton(props: { id: number }) {
  const { id } = props;
  return (
    <Button
      variant={"destructive"}
      onClick={() => {
        deletePlaylist(id);
      }}
    >
      Delete
    </Button>
  );
}
