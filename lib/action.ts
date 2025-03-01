"use server";

import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/schemas/signUpSchema";
import bcrypt from "bcryptjs";
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
