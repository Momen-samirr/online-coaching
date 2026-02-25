import { z } from "zod";

export const transformationSchema = z.object({
  titleAr: z.string().min(1, "Title (Arabic) is required"),
  titleEn: z.string().min(1, "Title (English) is required"),
  descriptionAr: z.string().min(1, "Description (Arabic) is required"),
  descriptionEn: z.string().min(1, "Description (English) is required"),
  imageUrl: z.string().url("Image URL must be a valid URL").optional().or(z.literal("")).transform((v) => v || undefined),
  order: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export type TransformationInput = z.infer<typeof transformationSchema>;

