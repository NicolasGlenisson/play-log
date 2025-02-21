import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// API returning games for search bar autocomplete
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json([]);
  }

  // Transform search into a word table
  const words = search.split(" ") || [];

  try {
    // Find games that contain all words
    const games = await prisma.game.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      where: {
        AND: words.map((word) => ({
          name: {
            contains: word,
            mode: "insensitive",
          },
        })),
      },
      take: 10,
    });

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
