"use client";

import { Button } from "@/components/custom/buttons";
import { deletePlaylist } from "@/lib/playlist";
import { Trash2 } from "lucide-react";

export function DeleteButton(props: { id: number }) {
  const { id } = props;
  return (
    <Button
      variant={"destructive"}
      size="sm"
      onClick={() => {
        deletePlaylist(id);
      }}
    >
      <span className="flex items-center">
        <Trash2 size={16} className="mr-2" />
        Delete
      </span>
    </Button>
  );
}
