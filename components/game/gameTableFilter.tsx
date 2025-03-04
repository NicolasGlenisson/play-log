"use client";

import { Toggle } from "@/components/custom/buttons";
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
        isPressed={params.get("finished") === "true"}
        onPressedChange={() => handleToggle("finished")}
        variant="secondary"
        type="submit"
      >
        <Gamepad2 />
      </Toggle>
      <Toggle
        isPressed={params.get("liked") === "true"}
        onPressedChange={() => handleToggle("liked")}
        variant="secondary"
        type="submit"
      >
        <Heart />
      </Toggle>
      <Toggle
        isPressed={params.get("addedToTodo") === "true"}
        onPressedChange={() => handleToggle("addedToTodo")}
        variant="secondary"
        type="submit"
      >
        <List />
      </Toggle>
    </div>
  );
}
