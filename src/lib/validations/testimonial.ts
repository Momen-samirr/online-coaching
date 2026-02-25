import { z } from "zod";

export const testimonialSchema = z.object({
  authorNameAr: z.string().optional(),
  authorNameEn: z.string().optional(),
  contentAr: z.string().min(1, "Content (Arabic) is required"),
  contentEn: z.string().min(1, "Content (English) is required"),
  avatarUrl: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  order: z.number().int().min(0).optional().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
