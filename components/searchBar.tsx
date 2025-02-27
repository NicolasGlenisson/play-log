"use client";

import { KeyboardEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface suggestionType {
  id: number;
  name: string;
  slug: string;
}
// Search bar component with autocompletion feature
// You can pass handleClickSuggestion props for custom click action
export default function SearchBar(props: {
  defaultValue?: string;
  handleClickSuggestion?: (game: suggestionType) => void;
}) {
  const defaultValue = props.defaultValue;
  const [search, setSearch] = useState(defaultValue || "");
  const [suggestions, setSuggestions] = useState<suggestionType[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

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

  const handleSearch = () => {
    // setSearch("");
    setIsFocused(false);
    router.push(`/game?name=${search}`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  let onClickSuggestion: (game: suggestionType) => void;
  let isLinkSuggestion: boolean;
  if (props.handleClickSuggestion) {
    onClickSuggestion = (game) => {
      props.handleClickSuggestion?.(game);
      setSearch("");
      setSuggestions([]);
    };
    isLinkSuggestion = false;
  } else {
    onClickSuggestion = () => {
      // By default, click will reset search and suggestions
      setSearch("");
      setSuggestions([]);
    };
    isLinkSuggestion = true;
  }

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
          onKeyDown={handleKeyDown}
        />
        {/* displayed only for default search bar without custom click action */}
        {props.handleClickSuggestion === undefined && (
          <Button
            className="px-4 py-2 flex items-center gap-2"
            onClick={handleSearch}
          >
            <Search size={18} />
          </Button>
        )}
      </div>

      {/* Display suggestions */}
      {suggestions.length > 0 && isFocused && (
        <ul className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-md z-50">
          {suggestions.map((game) => {
            return (
              <Suggestion
                key={game.slug}
                game={game}
                handleClick={onClickSuggestion}
                isLink={isLinkSuggestion}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface suggestionProps {
  game: suggestionType;
  handleClick: (game: suggestionType) => void;
  isLink: boolean;
}
function Suggestion(props: suggestionProps) {
  const { game, handleClick, isLink } = props;

  // Suggestion can be a link or just an action button
  if (isLink) {
    return (
      <Link
        key={`link-${game.id}`}
        href={`/game/${game.slug}`}
        className="suggestion-link"
        onClick={() => handleClick(game)}
      >
        <li
          key={game.id}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          {game.name}
        </li>
      </Link>
    );
  } else {
    return (
      <div
        key={`link-${game.id}`}
        className="suggestion-link"
        onClick={() => handleClick(game)}
      >
        <li
          key={game.id}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          {game.name}
        </li>
      </div>
    );
  }
}
