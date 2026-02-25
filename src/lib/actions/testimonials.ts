"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { testimonialSchema } from "../validations/testimonial";
import { actionResult, actionError, isPrismaNotFound } from "../action-result";

const testimonialUpdateSchema = testimonialSchema.extend({
  id: z.string().min(1, "ID is required"),
});

export async function getTestimonials(featuredOnly?: boolean) {
  return prisma.testimonial.findMany({
    where: featuredOnly ? { isFeatured: true } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTestimonial(input: unknown) {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  try {
    const t = await prisma.testimonial.create({
      data: parsed.data,
    });
    revalidatePath("/");
    return actionResult(t);
  } catch (e) {
    throw e;
  }
}

export async function updateTestimonial(input: unknown) {
  const parsed = testimonialUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const { id, ...data } = parsed.data;
  try {
    await prisma.testimonial.update({ where: { id }, data });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Testimonial not found.");
    throw e;
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Testimonial not found.");
    throw e;
  }
}
