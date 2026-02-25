import { z } from "zod";

export const planSchema = z.object({
  titleAr: z.string().min(1, "Title (Arabic) is required"),
  titleEn: z.string().min(1, "Title (English) is required"),
  descriptionAr: z.string().min(1, "Description (Arabic) is required"),
  descriptionEn: z.string().min(1, "Description (English) is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  duration: z.string().min(1, "Duration is required"),
  type: z.enum(["SUBSCRIPTION", "ONE_TIME"]),
  isActive: z.boolean().optional().default(true),
  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
});

export type PlanInput = z.infer<typeof planSchema>;

export const planUpdateSchema = planSchema.extend({
  id: z.string().min(1, "ID is required"),
});
export type PlanUpdateInput = z.infer<typeof planUpdateSchema>;

export const planPurchaseSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
});
export type PlanPurchaseInput = z.infer<typeof planPurchaseSchema>;
