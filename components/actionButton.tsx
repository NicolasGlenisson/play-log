"use client";
import { Gamepad2, Heart, Link, List } from "lucide-react";
import { gameAction, ActionType } from "@/lib/action";
import { UserGame } from "@prisma/client";
import { Toggle } from "@/components/ui/toggle";

interface ActionButtonProps {
  type: ActionType;
  gameSlug: string;
  userId: number | undefined;
  userGame?: UserGame | null;
}

export function ActionButton(props: ActionButtonProps) {
  const { type, gameSlug, userId, userGame } = props;
  let icon;
  let text;
  let isPressed = false;
  switch (type) {
    case "like":
      icon = <Heart size={24} />;
      text = "Like";
      isPressed = userGame?.liked || false;
      break;
    case "finish":
      icon = <Gamepad2 size={24} />;
      text = "Finish";
      isPressed = userGame?.finished || false;
      break;
    case "todo":
      icon = <List size={24} />;
      text = "Add to list";
      isPressed = userGame?.addedToTodo || false;
      break;
  }

  if (!userId) {
    return (
      <a href="/api/auth/signin">
        <Toggle pressed={false} variant="outline">
          {icon} {text}
        </Toggle>
      </a>
    );
  }
  const handleClick = async () => {
    await gameAction(gameSlug, userId, type);
  };

  if (userId) {
    return (
      <Toggle
        pressed={isPressed}
        variant="outline"
        onPressedChange={handleClick}
        type="submit"
      >
        {icon} {text}
      </Toggle>
    );
  }
}
