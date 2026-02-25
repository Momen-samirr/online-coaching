"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { actionResult, actionError, isPrismaNotFound } from "../action-result";

export async function getUsers() {
  return prisma.user.findMany({
    include: {
      _count: { select: { bookings: true, subscriptions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function setUserSuspended(userId: string, suspended: boolean) {
  if (!userId) return actionError("User ID is required");
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: suspended },
    });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("User not found.");
    throw e;
  }
}
