"use client";
import { Gamepad2, Heart, List } from "lucide-react";
import Link from "next/link";
import { gameAction, ActionType } from "@/lib/game";
import { UserGame } from "@prisma/client";
import { Toggle } from "@/components/custom/buttons";

interface ActionButtonProps {
  type: ActionType;
  gameSlug: string;
  userId: number | undefined;
  userGame: UserGame | null;
}

export function ActionButton(props: ActionButtonProps) {
  const { type, gameSlug, userId, userGame } = props;
  let icon;
  let text;
  let isPressed = false;
  switch (type) {
    case "like":
      icon = <Heart size={24} />;
      isPressed = userGame?.liked || false;
      text = isPressed ? "Liked" : "Like";
      break;
    case "finish":
      icon = <Gamepad2 size={24} />;
      isPressed = userGame?.finished || false;
      text = isPressed ? "Finished" : "Finish";
      break;
    case "todo":
      icon = <List size={24} />;
      isPressed = userGame?.addedToTodo || false;
      text = isPressed ? "Wishlisted" : "Wishlist";
      break;
  }

  if (!userId) {
    return (
      <Link href="/api/auth/signin">
        <Toggle isPressed={false} variant="secondary">
          {icon} {text}
        </Toggle>
      </Link>
    );
  }
  const handleClick = async () => {
    await gameAction(gameSlug, type);
  };

  return (
    <Toggle
      isPressed={isPressed}
      variant="secondary"
      onPressedChange={handleClick}
      type="submit"
    >
      {icon} {text}
    </Toggle>
  );
}
