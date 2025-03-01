import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await prisma.game.findMany({
    select: { slug: true },
  });

  const urls = games.map((game) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/game/${game.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return urls;
}
