"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Returns the current user's DB record and whether they are an admin.
 * Admin = env ADMIN_EMAIL matches their email OR their DB role is ADMIN.
 */
export async function getAdminContext() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin =
    (typeof adminEmail === "string" && adminEmail === email) ||
    dbUser?.role === "ADMIN";

  if (!isAdmin) return null;

  return { clerkUser, dbUser: dbUser ?? null };
}

/**
 * Use in server actions that must be admin-only. Returns null if not admin.
 */
export async function requireAdmin() {
  return getAdminContext();
}

/**
 * Returns whether the current user is an admin. Use for role-based UI (e.g. Navbar).
 * Verification is server-side; pass result as prop to client components.
 */
export async function getIsAdmin(): Promise<boolean> {
  const ctx = await getAdminContext();
  return !!ctx;
}
