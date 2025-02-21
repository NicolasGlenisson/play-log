"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

interface suggestionType {
  id: number;
  name: string;
  slug: string;
}
// Search bar component with autocompletion feature
export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<suggestionType[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // useDebouncedCallback to avoid making too many requests
  const fetchSuggestions = useDebouncedCallback(async (inputBalue) => {
    if (inputBalue.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/search?search=${inputBalue}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions :", error);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    fetchSuggestions(value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = useDebouncedCallback(async () => {
    // Add small delay to avoid losing focus before the link is clicked
    setIsFocused(false);
  }, 300);

  return (
    <div className="relative w-full">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <Input
          type="text"
          placeholder="Type a game name..."
          className="flex-1 px-4 py-2 border-none focus:ring-0"
          value={search}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Button className="px-4 py-2 flex items-center gap-2">
          <Search size={18} />
        </Button>
      </div>

      {/* Display suggestions */}
      {suggestions.length > 0 && isFocused && (
        <ul className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-md z-50">
          {suggestions.map((game) => {
            return (
              <Link
                key={`link-${game.id}`}
                href={`/game/${game.slug}`}
                className="suggestion-link"
                onClick={() => {
                  setSearch("");
                  setSuggestions([]);
                }}
              >
                <li
                  key={game.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {game.name}
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
}
