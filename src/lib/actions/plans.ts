"use server";

import { PlanType } from "@prisma/client";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { planSchema, planUpdateSchema, type PlanInput } from "../validations/plan";
import {
  actionResult,
  actionError,
  isPrismaUniqueViolation,
  isPrismaNotFound,
} from "../action-result";

export async function getPlans() {
  return prisma.plan.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getActivePlans() {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActivePlansWithFeatures() {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      features: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
    },
  });
}

export async function createPlan(input: unknown) {
  const parsed = planSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const data = parsed.data as PlanInput & { type: PlanType };
  try {
    const plan = await prisma.plan.create({
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        price: data.price,
        duration: data.duration,
        type: data.type as PlanType,
        isActive: data.isActive ?? true,
        imageUrl: data.imageUrl,
      },
    });
    revalidatePath("/");
    return actionResult(plan);
  } catch (e) {
    if (isPrismaUniqueViolation(e)) return actionError("A plan with this data already exists.");
    if (isPrismaNotFound(e)) return actionError("Plan not found.");
    throw e;
  }
}

export async function updatePlan(input: unknown) {
  const parsed = planUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const { id, ...data } = parsed.data;
  try {
    const plan = await prisma.plan.update({
      where: { id },
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        price: data.price,
        duration: data.duration,
        type: data.type as PlanType,
        isActive: data.isActive ?? true,
        imageUrl: data.imageUrl,
      },
    });
    revalidatePath("/");
    return actionResult(plan);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Plan not found.");
    throw e;
  }
}

export async function deletePlan(id: string) {
  try {
    await prisma.plan.delete({ where: { id } });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Plan not found.");
    throw e;
  }
}
