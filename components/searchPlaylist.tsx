"use client";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);

  // useDebouncedCallback to avoid making too many request
  const handleSearch = useDebouncedCallback((value: string) => {
    params.set("page", "1");
    params.set("search", value);
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <Input
      type="text"
      placeholder="Search for playlist name or tags (tags must be separated by commas)"
      className="mt-3"
      defaultValue={searchParams.get("query")?.toString()}
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
    />
  );
}
