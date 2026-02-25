import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogPostSchema = z.object({
  titleAr: z.string().min(1, "Title (Arabic) is required"),
  titleEn: z.string().min(1, "Title (English) is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only"),
  contentAr: z.string().min(1, "Content (Arabic) is required"),
  contentEn: z.string().min(1, "Content (English) is required"),
  excerptAr: z.string().optional(),
  excerptEn: z.string().optional(),
  metaTitleAr: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescriptionAr: z.string().optional(),
  metaDescriptionEn: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const blogPostUpdateSchema = blogPostSchema.extend({
  id: z.string().min(1, "ID is required"),
});
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
