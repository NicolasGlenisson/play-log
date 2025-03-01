import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg mt-10">
      <Skeleton className="w-[60%] h-8 mb-4" /> {/* Title Skeleton */}
      <Skeleton className="w-[90%] h-4 mb-2" /> {/* Description Skeleton */}
      <Skeleton className="w-[90%] h-4 mb-2" /> {/* Description Skeleton */}
      <Skeleton className="w-[90%] h-4 mb-2" /> {/* Description Skeleton */}
      <Skeleton className="w-[90%] h-4 mb-2" /> {/* Description Skeleton */}
      <Skeleton className="w-[90%] h-4 mb-2" /> {/* Description Skeleton */}
    </div>
  );
}
