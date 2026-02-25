"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { planPurchaseSchema } from "../validations/plan";
import { actionResult, actionError, isPrismaNotFound } from "../action-result";
import { getOrCreateCurrentUser } from "./user.action";
import { initiatePayment } from "./payments";

export async function startPlanCheckout(planId: string) {
  const parsed = planPurchaseSchema.safeParse({ planId });
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const user = await getOrCreateCurrentUser();
  if (!user) {
    return actionError("Please sign in to purchase a plan");
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return actionError("Plan not found");
  if (!plan.isActive) return actionError("This plan is not available");
  if (plan.type !== "SUBSCRIPTION") {
    return actionError("This plan is not a subscription. Use Book a session for one-time plans.");
  }

  const amountCents = Math.round(Number(plan.price) * 100);

  try {
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "PENDING",
        startDate: new Date(),
      },
    });

    const { iframeUrl } = await initiatePayment({
      userId: user.id,
      amountCents,
      currency: "EGP",
      subscriptionId: subscription.id,
      billingData: {
        firstName: user.firstName ?? "Client",
        lastName: user.lastName ?? "User",
        email: user.email,
        phone: user.phone ?? undefined,
      },
    });

    revalidatePath("/plans");
    revalidatePath("/dashboard");
    return actionResult({ paymentUrl: iframeUrl });
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Plan or user not found");
    throw e;
  }
}

export async function getMySubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });
}
