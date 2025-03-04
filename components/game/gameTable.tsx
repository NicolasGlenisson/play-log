"use client";

import { Game, UserGame } from "@prisma/client";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/dataTable";
import GameTableFilter from "@/components/game/gameTableFilter";

const check = <Check className="stroke-green-500" />;
const cross = <X className="stroke-red-500" />;

// Columns configuration to use with tanstack table
const gameColumns: ColumnDef<UserGame & { game: Game }>[] = [
  {
    accessorKey: "game.name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/game/${row.original.game.slug}`}>
          {row.original.game.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "finished",
    header: "Finished",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("finished") ? check : cross}
      </div>
    ),
  },
  {
    accessorKey: "liked",
    header: "Liked",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("liked") ? check : cross}
      </div>
    ),
  },
  {
    accessorKey: "addedToTodo",
    header: "Wishlisted",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("addedToTodo") ? check : cross}
      </div>
    ),
  },
];

export default function GameTable(props: {
  userGames: (UserGame & { game: Game })[];
}) {
  const { userGames } = props;

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-5xl p-6 bg-[#FAEDCD]/60 rounded-xl shadow-lg space-y-6">
        <GameTableFilter />
        <div className="overflow-x-auto">
          <div className="w-full min-w-[320px] max-w-full">
            <DataTable columns={gameColumns} data={userGames} />
          </div>
        </div>
      </div>
    </div>
  );
}
