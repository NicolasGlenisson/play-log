"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Prisma } from "@prisma/client";
import { Badge } from "./ui/badge";
import Link from "next/link";

export type PlayListType = Prisma.PlayListGetPayload<{
  include: { user: true; PlayListGames: true };
}>;
interface PlayListProps {
  playlist: PlayListType;
}
export default function PlayListCard({ playlist }: PlayListProps) {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <Card className="w-[18rem] h-[20rem] overflow-hidden">
        <CardHeader className="h-[25%] overflow-hidden whitespace-nowrap">
          <CardTitle className="">{playlist.name}</CardTitle>
          <CardDescription>{playlist.user.name}</CardDescription>
        </CardHeader>
        <CardContent className="h-[60%]">
          <div className="h-full overflow-hidden text-ellipsis whitespace-normal">
            {playlist.description || "No description"}
          </div>
        </CardContent>
        <CardFooter>
          {playlist.tags.map((tag, index) => (
            <Badge variant="secondary" className="mr-1" key={index}>
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
