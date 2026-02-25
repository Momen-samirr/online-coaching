import { z } from "zod";

export const planFeatureSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  titleAr: z.string().min(1, "Title (Arabic) is required"),
  titleEn: z.string().min(1, "Title (English) is required"),
  order: z.number().int().min(0).optional().default(0),
});

export type PlanFeatureInput = z.infer<typeof planFeatureSchema>;

export const planFeatureUpdateSchema = planFeatureSchema
  .omit({ planId: true })
  .extend({
    id: z.string().min(1, "ID is required"),
  });

export type PlanFeatureUpdateInput = z.infer<typeof planFeatureUpdateSchema>;
