"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { createBookingSchema } from "../validations/booking";
import { actionResult, actionError, isPrismaNotFound } from "../action-result";

export async function getBookings() {
  return prisma.booking.findMany({
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
      plan: { select: { titleEn: true, titleAr: true } },
    },
    orderBy: { date: "desc" },
  });
}

export async function getMyBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      plan: { select: { titleEn: true, titleAr: true, duration: true } },
    },
    orderBy: { date: "desc" },
  });
}

export async function createBooking(input: unknown) {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const { userId, planId, date, time, duration: d, notes } = parsed.data;
  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return actionError("Plan not found");
    const duration = d ?? 30;
    const booking = await prisma.booking.create({
      data: {
        userId,
        planId,
        date,
        time,
        duration,
        notes,
        status: "PENDING",
      },
    });
    revalidatePath("/");
    return actionResult(booking);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Plan or user not found.");
    throw e;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Booking not found.");
    throw e;
  }
}

export async function rescheduleBooking(
  bookingId: string,
  date: Date,
  time: string
) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { date, time },
    });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Booking not found.");
    throw e;
  }
}
