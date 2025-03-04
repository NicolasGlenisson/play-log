import { Skeleton } from "@/components/ui/skeleton";
import { Award, Clock, Tag, Users, Gamepad } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full max-w-4xl">
      {/* Hero section skeleton */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CCD5AE]/70 to-[#FAEDCD]/70 animate-pulse"></div>

        {/* Game title overlay skeleton */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6">
          <Skeleton className="w-[70%] max-w-md h-12 md:h-14 mb-4 bg-white/30" />
          <Skeleton className="w-36 h-8 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Main content card skeleton */}
      <div className="bg-[#FDFAE0] rounded-3xl shadow-lg p-8 relative z-10 -mt-16 mx-4 border border-[#E9EDCA]">
        {/* Action buttons skeleton */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 mt-2">
          <Skeleton className="w-28 h-10 rounded-full bg-[#FAEDCD]" />
          <Skeleton className="w-28 h-10 rounded-full bg-[#CCD5AE]" />
          <Skeleton className="w-28 h-10 rounded-full bg-[#E9EDCA]" />
        </div>

        {/* Game details skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column with image skeleton */}
          <div className="md:col-span-1">
            <Skeleton className="rounded-2xl aspect-[3/4] border-4 border-[#E9EDCA] transform rotate-1 bg-gradient-to-br from-[#CCD5AE]/60 to-[#FAEDCD]/60" />

            {/* Metadata with icons skeleton */}
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="text-[#949F6E]/50 mt-1" />
                <div className="w-full">
                  <Skeleton className="w-20 h-5 mb-3 bg-[#E9EDCA]" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="w-16 h-6 rounded-full bg-[#E9EDCA]/70" />
                    <Skeleton className="w-20 h-6 rounded-full bg-[#E9EDCA]/70" />
                    <Skeleton className="w-14 h-6 rounded-full bg-[#E9EDCA]/70" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="text-[#949F6E]/50 mt-1" />
                <div className="w-full">
                  <Skeleton className="w-20 h-5 mb-2 bg-[#E9EDCA]" />
                  <Skeleton className="w-28 h-4 bg-[#E9EDCA]/60" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gamepad className="text-[#949F6E]/50 mt-1" />
                <div className="w-full">
                  <Skeleton className="w-20 h-5 mb-2 bg-[#E9EDCA]" />
                  <Skeleton className="w-36 h-4 bg-[#E9EDCA]/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Right column with description skeleton */}
          <div className="md:col-span-2">
            <div className="bg-[#FAEDCD]/60 rounded-2xl p-6 mb-6 border border-[#CCD5AE]/50">
              <Skeleton className="w-40 h-7 mb-4 bg-[#CCD5AE]/50" />
              <div className="space-y-2">
                <Skeleton className="w-full h-4 bg-[#CCD5AE]/30" />
                <Skeleton className="w-full h-4 bg-[#CCD5AE]/30" />
                <Skeleton className="w-full h-4 bg-[#CCD5AE]/30" />
                <Skeleton className="w-full h-4 bg-[#CCD5AE]/30" />
                <Skeleton className="w-3/4 h-4 bg-[#CCD5AE]/30" />
              </div>
            </div>

            {/* Additional sections skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#E9EDCA]/70 rounded-2xl p-5 border border-[#CCD5AE]/60">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="text-[#866C47]/50" />
                  <Skeleton className="w-24 h-5 bg-[#CCD5AE]/40" />
                </div>
                <div className="text-center">
                  <Skeleton className="w-16 h-10 mx-auto bg-[#CCD5AE]/50" />
                </div>
              </div>

              <div className="bg-[#E9EDCA]/70 rounded-2xl p-5 border border-[#CCD5AE]/60">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-[#866C47]/50" />
                  <Skeleton className="w-20 h-5 bg-[#CCD5AE]/40" />
                </div>
                <div className="text-center">
                  <Skeleton className="w-16 h-10 mx-auto bg-[#CCD5AE]/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
