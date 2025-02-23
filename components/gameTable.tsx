"use client";

import { Game, UserGame } from "@prisma/client";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./dataTable";

const check = <Check className="stroke-green-500" />;
const cross = <X className="stroke-red-500" />;
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
    cell: ({ row }) => (row.getValue("finished") ? check : cross),
  },
  {
    accessorKey: "liked",
    header: "Liked",
    cell: ({ row }) => (row.getValue("liked") ? check : cross),
  },
  {
    accessorKey: "addedToTodo",
    header: "Play List",
    cell: ({ row }) => (row.getValue("addedToTodo") ? check : cross),
  },
];

export default function GameTable(props: {
  userGames: (UserGame & { game: Game })[];
}) {
  const { userGames } = props;

  return <DataTable columns={gameColumns} data={userGames} />;
}
