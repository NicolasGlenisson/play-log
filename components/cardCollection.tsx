"use client";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface CardProps {
  title: string;
  date: string;
  description: string;
  url?: string;
}
interface CardData {
  id: number;
  title: string;
  date: string;
  description: string;
  url?: string;
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
          />
        ))}
      </div>
    </div>
  );
}

function Card({ title, date, description, url }: CardProps) {
  const Card = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 h-64">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-2">{date}</p>
      <p className="text-sm text-gray-700 leading-tight line-clamp-5">
        {description}
      </p>
    </div>
  );

  if (!url) {
    return Card;
  }

  return <Link href={url}>{Card}</Link>;
}

export function CardGridSkeleton() {
  const skeletonData = { id: 0, title: "", date: "", description: "" };
  const cards = Array(3)
    .fill(null)
    .map((_, i) => ({ ...skeletonData, id: i }));

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
