"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import {
  planFeatureSchema,
  planFeatureUpdateSchema,
  type PlanFeatureInput,
  type PlanFeatureUpdateInput,
} from "../validations/plan-feature";
import { actionResult, actionError, isPrismaNotFound } from "../action-result";

export async function getPlanFeatures(planId: string) {
  return prisma.planFeature.findMany({
    where: { planId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function createPlanFeature(input: unknown) {
  const parsed = planFeatureSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const data = parsed.data as PlanFeatureInput;
  try {
    const feature = await prisma.planFeature.create({
      data: {
        planId: data.planId,
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        order: data.order ?? 0,
      },
    });
    revalidatePath("/");
    revalidatePath("/plans");
    return actionResult(feature);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Plan not found.");
    throw e;
  }
}

export async function updatePlanFeature(input: unknown) {
  const parsed = planFeatureUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const { id, ...data } = parsed.data as PlanFeatureUpdateInput & { id: string };
  try {
    await prisma.planFeature.update({
      where: { id },
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        order: data.order ?? 0,
      },
    });
    revalidatePath("/");
    revalidatePath("/plans");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Feature not found.");
    throw e;
  }
}

export async function deletePlanFeature(id: string) {
  try {
    await prisma.planFeature.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/plans");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Feature not found.");
    throw e;
  }
}
