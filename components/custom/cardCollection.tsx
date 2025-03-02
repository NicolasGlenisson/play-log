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
          gap-4
          grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))]
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 h-64 relative group">
      {/* Card content */}
      <div className="transition-opacity duration-200 group-hover:opacity-40">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-2">{date}</p>
        <p className="text-sm text-gray-700 leading-tight line-clamp-5">
          {description}
        </p>
      </div>

      {/* Hover content */}
      {hover && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          onClick={(e) => {
            console.log("test");
            e.stopPropagation();
          }} // Avoid being redirected by the link when clicking in hover
        >
          <div className="bg-white/80 rounded-lg shadow-lg p-4 border border-gray-200">
            {hover}
          </div>
        </div>
      )}
    </div>
  );

  if (!url) {
    return CardContent;
  }

  return <Link href={url}>{CardContent}</Link>;
}

export function CardGridSkeleton() {
  return (
    <div className="p-4 w-full">
      <div
        className="
        grid
        gap-4
        grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))]
      "
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden p-4 h-64"
          >
            <Skeleton className="w-[80%] h-[10%]" />
            <Skeleton className="mt-5 w-[70%] h-[70%]" />
          </div>
        ))}
      </div>
    </div>
  );
}
