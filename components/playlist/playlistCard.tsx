"use client";

import { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { List, User } from "lucide-react";

export type PlayListType = Prisma.PlayListGetPayload<{
  include: { user: true; playListGames: true };
}>;

interface PlayListProps {
  playlist: PlayListType;
}

export default function PlayListCard({ playlist }: PlayListProps) {
  return (
    <Link
      href={`/list/${playlist.id}`}
      className="block w-full max-w-sm sm:w-[280px] h-[320px] transform transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#BFA68A]/60 focus:ring-offset-2 rounded-xl"
    >
      <div className="w-full h-full bg-[#FDFAE0] rounded-xl overflow-hidden shadow-md border border-[#E9DCC3]/70 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#E9DCC3] flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg text-[#5E5034] truncate pr-2">
              {playlist.name}
            </h3>
            <div className="flex items-center bg-[#F0E2CA] px-2 py-0.5 rounded-full">
              <List size={14} className="text-[#9B7E55] mr-1" />
              <span className="text-xs font-medium text-[#5E5034]">
                {playlist.playListGames.length}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm text-[#9B7E55]">
            <User size={14} className="mr-1" />
            <span className="truncate">
              {playlist.user.name || "Anonymous"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow overflow-hidden">
          <div className="line-clamp-5 text-sm text-[#6B5D40] leading-relaxed h-full">
            {playlist.description || (
              <span className="italic text-[#9B7E55]/80">
                Aucune description disponible
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E9DCC3] flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {playlist.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                className="bg-[#F0E2CA] hover:bg-[#E6D2AF] text-[#5E5034] border border-[#DBC99F]/40 text-xs py-0"
              >
                {tag}
              </Badge>
            ))}
            {playlist.tags.length > 3 && (
              <Badge className="bg-[#E6D2AF] hover:bg-[#DBC99F] text-[#6B5D40] border border-[#D0B68A]/40 text-xs py-0">
                +{playlist.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
