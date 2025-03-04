"use client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

interface CardProps {
  title: string;
  date: string;
  description: string;
  url?: string;
  hover?: React.ReactNode;
}
interface CardData extends CardProps {
  id: number;
}

interface CardGridProps {
  cards: CardData[];
}

export function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="p-4">
      <div
        className="
          grid
          gap-6
          grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))]
        "
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            date={card.date}
            description={card.description}
            url={card.url}
            hover={card.hover}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ title, date, description, url, hover }: CardProps) {
  const CardContent = (
    <div className="bg-[#FAEDCD] rounded-xl border border-[#E9DCC3]/70 shadow-sm overflow-hidden h-64 relative group transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
      {/* Card content */}
      <div className="p-5 transition-opacity duration-200 group-hover:opacity-40">
        <h2 className="text-xl font-bold text-[#5E5034] mb-2 line-clamp-1">
          {title}
        </h2>
        {date && (
          <p className="text-sm text-[#9B7E55] mb-3 flex items-center">
            <span className="inline-block w-1.5 h-1.5 bg-[#A89669] rounded-full mr-2"></span>
            {date}
          </p>
        )}
        <p className="text-sm text-[#6B5E40] leading-relaxed line-clamp-5">
          {description}
        </p>
      </div>

      {/* Hover content */}
      {hover && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="bg-[#FDFAE0]/95 backdrop-blur-sm rounded-lg shadow-sm p-5 border border-[#E9DCC3] max-w-[80%]">
            {hover}
          </div>
        </div>
      )}
    </div>
  );

  if (!url) {
    return CardContent;
  }

  return (
    <Link
      href={url}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA68A]/50 focus-visible:ring-offset-2 rounded-xl"
    >
      {CardContent}
    </Link>
  );
}

export function CardGridSkeleton() {
  return (
    <div className="p-4 w-full">
      <div
        className="
        grid
        gap-6
        grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))]
      "
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#FAEDCD] rounded-xl border border-[#E9DCC3]/70 shadow-sm overflow-hidden h-64 relative group"
          >
            <div className="flex flex-col flex-wrap justify-center gap-3 mb-8 mt-2 p-6">
              <Skeleton className="w-28 h-10 rounded-full bg-[#FDFAE0]" />
              <Skeleton className="w-56 h-10 rounded-full bg-[#FDFAE0]" />
              <Skeleton className="w-56 h-10 rounded-full bg-[#FDFAE0]" />
              <Skeleton className="w-56 h-10 rounded-full bg-[#FDFAE0]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
