"use server";

import prisma from "@/lib/prisma";
import { signUpSchema } from "@/lib/schemas/signUpSchema";
import { User, UserGame } from "@prisma/client";
import { Action } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";
import { GamepadIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
  message: string;
  success: boolean;
};

// Sign up form action
export async function onSubmitSignUpAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);

  // Validate form data with zod
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      success: false,
    };
  }

  // Check if a user with the same email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return {
      message: "User with this email already exists",
      success: false,
    };
  }

  // Try to create the user
  try {
    const newUser = {
      email: parsed.data.email,
      name: parsed.data.username,
      password: bcrypt.hashSync(parsed.data.password, 10),
    };

    await prisma.user.create({
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Cannot create user",
      success: false,
    };
  }
  redirect("/");
}

export type ActionType = "like" | "finish" | "todo";

export async function gameAction(
  gameSlug: string,
  userId: number,
  actionType: ActionType
) {
  // Get game to get id and check if exists
  const game = await prisma.game.findUnique({
    where: {
      slug: gameSlug,
    },
  });

  if (!game) {
    return {
      message: "Game not found",
      success: false,
    };
  }

  // Get user game relation if exits
  const userGame = await prisma.userGame.findUnique({
    where: {
      userId_gameId: {
        userId: userId,
        gameId: game.id,
      },
    },
  });

  let keyToUpdate: string;
  switch (actionType) {
    case "like":
      keyToUpdate = "liked";
      break;
    case "finish":
      keyToUpdate = "finished";
      break;
    case "todo":
      keyToUpdate = "addedToTodo";
      break;
  }

  // Create user game relation if not exists
  if (!userGame) {
    await prisma.userGame.create({
      data: {
        userId,
        gameId: game.id,
        [keyToUpdate]: true,
      },
    });
  } else {
    // Else we update it
    await prisma.userGame.update({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: game.id,
        },
      },
      data: {
        // Toggle the value
        [keyToUpdate]: !userGame[keyToUpdate as keyof UserGame],
      },
    });
  }

  revalidatePath(`/game/${gameSlug}`);
}
