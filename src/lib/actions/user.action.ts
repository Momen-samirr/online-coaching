"use server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function syncUser() {
  try {
    const user = await currentUser();
    if (!user) return;

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return;

    const existingByClerkId = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (existingByClerkId) {
      return existingByClerkId;
    }

    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingByEmail) {
      await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkId: user.id,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          phone: user.phoneNumbers[0]?.phoneNumber ?? undefined,
        },
      });
      return prisma.user.findUniqueOrThrow({ where: { id: existingByEmail.id } });
    }

    return prisma.user.create({
      data: {
        clerkId: user.id,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        email,
        phone: user.phoneNumbers[0]?.phoneNumber ?? undefined,
      },
    });
  } catch (error) {
    console.log("Error in syncUser server action", error);
  }
}

export async function getOrCreateCurrentUser() {
  const synced = await syncUser();
  return synced ?? null;
}
