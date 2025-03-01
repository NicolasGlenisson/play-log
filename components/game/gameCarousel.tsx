"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
  summary: string | null;
  slug: string;
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
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {games.map((game) => (
            <div key={game.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="m-4">
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {/* Placeholder for game image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <span className="text-gray-600">Game Image</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                  <Link
                    href={`/game/${game.slug}`}
                    className="text-xl font-bold hover:text-blue-600 transition-colors"
                  >
                    {game.name}
                  </Link>
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {game.summary || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-12",
          "hover:bg-background/80 hidden md:flex"
        )}
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
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
