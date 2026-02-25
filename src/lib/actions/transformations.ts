"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { transformationSchema } from "../validations/transformation";
import { actionResult, actionError, isPrismaNotFound } from "../action-result";

const transformationUpdateSchema = transformationSchema.extend({
  id: z.string().min(1, "ID is required"),
});

export async function getTransformations(activeOnly?: boolean) {
  return prisma.transformation.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTransformation(input: unknown) {
  const parsed = transformationSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }

  try {
    const t = await prisma.transformation.create({
      data: parsed.data,
    });
    revalidatePath("/");
    return actionResult(t);
  } catch (e) {
    throw e;
  }
}

export async function updateTransformation(input: unknown) {
  const parsed = transformationUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const { id, ...data } = parsed.data;

  try {
    await prisma.transformation.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Transformation not found.");
    throw e;
  }
}

export async function deleteTransformation(id: string) {
  try {
    await prisma.transformation.delete({ where: { id } });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Transformation not found.");
    throw e;
  }
}

