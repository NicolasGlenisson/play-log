"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/custom/buttons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import GameImage from "./gameImage";

type Game = {
  id: number;
  name: string;
  summary: string | null;
  slug: string;
  imageId: string | null;
};

export default function Carousel({ games }: { games: Game[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {games.map((game) => (
            <div key={game.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="m-4">
                <div className="relative aspect-video bg-[#CCD5AE] rounded-lg overflow-hidden">
                  {/* Placeholder for game image */}
                  {!game.imageId ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#CCD5AE]">
                      <span className="text-[#6B5E40] text-2xl font-bold">
                        Game Image
                      </span>
                    </div>
                  ) : (
                    <GameImage
                      imageId={game.imageId}
                      className="w-full h-full object-cover p-1 rounded-xl"
                    />
                  )}
                </div>
                <div className="mt-4 p-4 bg-[#CCD5AE] rounded-lg shadow-md">
                  <Link
                    href={`/game/${game.slug}`}
                    className="text-xl font-bold text-[#6B5E40]"
                  >
                    {game.name}
                  </Link>
                  <p className="mt-2 text-[#6B5E40] line-clamp-2">
                    {game.summary || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="primary"
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
        variant="primary"
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
