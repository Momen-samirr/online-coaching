import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Locale = "en" | "ar";

export function getLocalizedPlanField(
  plan: { titleAr: string; titleEn: string; descriptionAr: string; descriptionEn: string },
  field: "title" | "description",
  locale: Locale
): string {
  if (field === "title") return locale === "ar" ? plan.titleAr : plan.titleEn;
  return locale === "ar" ? plan.descriptionAr : plan.descriptionEn;
}

export function getLocalizedSettingsField(
  settings: { coachBioAr: string | null; coachBioEn: string | null },
  field: "bio",
  locale: Locale
): string {
  if (field === "bio") return locale === "ar" ? (settings.coachBioAr ?? "") : (settings.coachBioEn ?? "");
  return "";
}

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
