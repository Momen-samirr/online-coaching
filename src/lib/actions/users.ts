"use server";

import { UserRole } from "@prisma/client";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { actionResult, actionError, isPrismaNotFound } from "../action-result";
import { requireAdmin } from "../auth-admin";

const VALID_ROLES: UserRole[] = ["USER", "ADMIN"];

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

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<ReturnType<typeof actionResult<void>>> {
  const admin = await requireAdmin();
  if (!admin) return actionError("Unauthorized. Only admins can change roles.");

  if (!userId?.trim()) return actionError("User ID is required.");
  if (!VALID_ROLES.includes(role)) return actionError("Invalid role.");

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/admin/users");
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("User not found.");
    throw e;
  }
}
