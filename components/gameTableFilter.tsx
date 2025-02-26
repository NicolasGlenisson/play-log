"use client";

import { Toggle } from "@/components/ui/toggle";
import { Gamepad2, Heart, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function GameTableFilter() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const handleToggle = (type: string) => {
    params.set("page", "1");
    if (params.get(type) === "true") {
      params.delete(type);
    } else {
      params.set(type, "true");
    }

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex justify-center space-x-2 mt-2">
      <Toggle
        pressed={params.get("finished") === "true"}
        onPressedChange={() => handleToggle("finished")}
        variant="outline"
        type="submit"
      >
        <Gamepad2 />
      </Toggle>
      <Toggle
        pressed={params.get("liked") === "true"}
        onPressedChange={() => handleToggle("liked")}
        variant="outline"
        type="submit"
      >
        <Heart />
      </Toggle>
      <Toggle
        pressed={params.get("addedToTodo") === "true"}
        onPressedChange={() => handleToggle("addedToTodo")}
        variant="outline"
        type="submit"
      >
        <List />
      </Toggle>
    </div>
  );
}
