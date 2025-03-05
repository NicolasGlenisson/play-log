"use server";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import { editProfileSchema } from "./schemas/editProfileSchema";
import { getServerSession } from "next-auth";
import { options } from "./auth";
import bcrypt from "bcryptjs";
import { signUpSchema } from "./schemas/signUpSchema";

export async function fetchUser(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error(error);
    redirect("/");
  }
}
type FormState = {
  message: string;
  success: boolean;
};
// Edit profile form action
export async function editProfileFormAction(
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);

  // Validate form data with zod
  const parsed = editProfileSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      success: false,
    };
  }

  // get connected user
  const session = await getServerSession(options);
  if (!session) {
    throw new Error("User not connected");
  }

  // Check if a user with the same email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser && existingUser.id !== session.user.id) {
    return {
      message: "User with this email already exists",
      success: false,
    };
  }

  // Try to create the user
  try {
    const editedUser = {
      email: parsed.data.email,
      name: parsed.data.username,
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: editedUser,
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Cannot create user",
      success: false,
    };
  }
  redirect("/");
}

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
      password: await bcrypt.hash(parsed.data.password, 10),
    };

    await prisma.user.create({
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Cannot create user",
      success: false,
    };
  }
  redirect("/");
}
