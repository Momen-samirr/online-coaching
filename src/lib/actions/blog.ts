"use server";

import { BlogPostStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { blogPostSchema, blogPostUpdateSchema } from "../validations/blog";
import { actionResult, actionError, isPrismaUniqueViolation, isPrismaNotFound } from "../action-result";

export async function getBlogPosts(admin = false) {
  return prisma.blogPost.findMany({
    where: admin ? undefined : { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  });
}

export async function createBlogPost(input: unknown) {
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const data = parsed.data;
  try {
    const post = await prisma.blogPost.create({
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        slug: data.slug,
        contentAr: data.contentAr,
        contentEn: data.contentEn,
        excerptAr: data.excerptAr,
        excerptEn: data.excerptEn,
        metaTitleAr: data.metaTitleAr,
        metaTitleEn: data.metaTitleEn,
        metaDescriptionAr: data.metaDescriptionAr,
        metaDescriptionEn: data.metaDescriptionEn,
        status: data.status as BlogPostStatus,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });
    revalidatePath("/");
    return actionResult(post);
  } catch (e) {
    if (isPrismaUniqueViolation(e)) return actionError("A post with this slug already exists.");
    throw e;
  }
}

export async function updateBlogPost(input: unknown) {
  const parsed = blogPostUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const { id, ...data } = parsed.data;
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    const publishedAt =
      data.status === "PUBLISHED"
        ? existing?.publishedAt ?? new Date()
        : existing?.publishedAt ?? null;
    await prisma.blogPost.update({
      where: { id },
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        slug: data.slug,
        contentAr: data.contentAr,
        contentEn: data.contentEn,
        excerptAr: data.excerptAr,
        excerptEn: data.excerptEn,
        metaTitleAr: data.metaTitleAr,
        metaTitleEn: data.metaTitleEn,
        metaDescriptionAr: data.metaDescriptionAr,
        metaDescriptionEn: data.metaDescriptionEn,
        status: data.status as BlogPostStatus,
        publishedAt,
      },
    });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Post not found.");
    if (isPrismaUniqueViolation(e)) return actionError("Slug already in use.");
    throw e;
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/");
    return actionResult(undefined);
  } catch (e) {
    if (isPrismaNotFound(e)) return actionError("Post not found.");
    throw e;
  }
}
