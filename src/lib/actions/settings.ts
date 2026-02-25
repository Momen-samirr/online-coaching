"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { settingsSchema } from "../validations/settings";
import { actionResult, actionError } from "../action-result";

export async function getSettings() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        contactEmail: "contact@example.com",
      },
    });
  }
  return settings;
}

export async function updateSettings(data: unknown) {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const d = parsed.data;
  const contactEmail = d.contactEmail ?? "contact@example.com";
  const updateData = {
    logoUrl: d.logoUrl || null,
    contactEmail,
    contactPhone: d.contactPhone || null,
    socialLinks: d.socialLinks ?? undefined,
    paymobApiKey: d.paymobApiKey ?? undefined,
    paymobIntegrationId: d.paymobIntegrationId ?? undefined,
    paymobHmacSecret: d.paymobHmacSecret ?? undefined,
    paymobIframeId: d.paymobIframeId ?? undefined,
    emailFrom: d.emailFrom || null,
    emailProvider: d.emailProvider ?? undefined,
    coachBioAr: d.coachBioAr ?? undefined,
    coachBioEn: d.coachBioEn ?? undefined,
    experienceYears: d.experienceYears ?? undefined,
    certifications: d.certifications ?? undefined,
  };
  try {
    const existing = await prisma.settings.findFirst();
    if (!existing) {
      await prisma.settings.create({
        data: {
          contactEmail: updateData.contactEmail,
          logoUrl: updateData.logoUrl,
          contactPhone: updateData.contactPhone,
          socialLinks: updateData.socialLinks as object | undefined,
          paymobApiKey: updateData.paymobApiKey,
          paymobIntegrationId: updateData.paymobIntegrationId,
          paymobHmacSecret: updateData.paymobHmacSecret,
          paymobIframeId: updateData.paymobIframeId,
          emailFrom: updateData.emailFrom,
          emailProvider: updateData.emailProvider,
          coachBioAr: updateData.coachBioAr,
          coachBioEn: updateData.coachBioEn,
          experienceYears: updateData.experienceYears,
          certifications: updateData.certifications,
        },
      });
    } else {
      await prisma.settings.update({
        where: { id: existing.id },
        data: updateData as Record<string, unknown>,
      });
    }
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    return actionError("Failed to update settings.");
  }
}
