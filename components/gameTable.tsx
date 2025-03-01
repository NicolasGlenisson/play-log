"use client";

import { Game, UserGame } from "@prisma/client";
import { Check, X, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dataTable";
import { Button } from "./ui/button";
import GameTableFilter from "@/components/gameTableFilter";

const check = <Check className="stroke-green-500" />;
const cross = <X className="stroke-red-500" />;
// Columns configuration to use with tanstack table
const gameColumns: ColumnDef<UserGame & { game: Game }>[] = [
  {
    accessorKey: "game.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
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
    <div className="flex justify-center bg-gray-100 py-10">
      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md space-y-4">
        <GameTableFilter />
        <div className="overflow-x-auto">
          <div className="w-full min-w-[300px] max-w-full">
            <DataTable columns={gameColumns} data={userGames} />
          </div>
        </div>
      </div>
    </div>
  );
}
