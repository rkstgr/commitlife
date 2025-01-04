import bcrypt from "bcryptjs";
import { db } from "~/lib/db.server";
import type { Prisma, User } from "@prisma/client";

export type CreateUserInput = {
  email: string;
  authProvider: string;
  providerId: string;
  hashedPassword: string;
} & Partial<
  Omit<Prisma.UserCreateInput, "email" | "authProvider" | "providerId">
>;

export async function createUserFromProvider(user: CreateUserInput) {
  return await db.user.create({
    data: {
      email: user.email,
      authProvider: user.authProvider || "email",
      providerId: user.providerId,
      hashedPassword: user.hashedPassword,
    },
  });
}

export async function getUserByProviderId(
  provider: string,
  providerId: string
) {
  return await db.user.findFirst({
    where: {
      authProvider: provider,
      providerId,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function findOrCreateEmailUser(
  email: string,
  hashedPassword: string
): Promise<User> {
  let user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        hashedPassword,
        authProvider: "email",
        providerId: "",
      },
    });
  }

  return user;
}
