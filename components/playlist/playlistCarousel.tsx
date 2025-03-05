"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../custom/buttons";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Playlist = {
  id: number;
  name: string;
  description: string | null;
  tags: string[];
  user: {
    name: string | null;
  };
};

export default function PlaylistCarousel({
  playlists,
}: {
  playlists: Playlist[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="m-4">
                <div className="p-6 bg-[#CCD5AE] rounded-lg shadow-md">
                  <Link
                    href={`/list/${playlist.id}`}
                    className="text-2xl text-[#6B5E40] font-bold"
                  >
                    {playlist.name}
                  </Link>
                  <p className="mt-2 text-sm text-[#6B5E40]">
                    Created by {playlist.user.name || "Anonymous"}
                  </p>
                  <p className="mt-4 text-[#6B5E40] line-clamp-3">
                    {playlist.description || "No description available"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {playlist.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        size="sm"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-12",
          "hover:bg-background/80 hidden md:flex"
        )}
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-12",
          "hover:bg-background/80 hidden md:flex"
        )}
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
