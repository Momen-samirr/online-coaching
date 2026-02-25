import { z } from "zod";

export const settingsSchema = z.object({
  logoUrl: z.union([z.string().url(), z.literal("")]).optional(),
  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().optional(),
  socialLinks: z.record(z.string(), z.string().url()).optional().nullable(),
  paymobApiKey: z.string().optional().nullable(),
  paymobIntegrationId: z.string().optional().nullable(),
  paymobHmacSecret: z.string().optional().nullable(),
  paymobIframeId: z.string().optional().nullable(),
  emailFrom: z.string().optional().nullable(),
  emailProvider: z.string().optional().nullable(),
  coachBioAr: z.string().optional().nullable(),
  coachBioEn: z.string().optional().nullable(),
  experienceYears: z.number().int().min(0).optional().nullable(),
  certifications: z.string().optional().nullable(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
