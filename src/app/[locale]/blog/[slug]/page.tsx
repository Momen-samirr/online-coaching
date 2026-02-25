import { getBlogPostBySlug } from "@/lib/actions/blog";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as "en" | "ar";
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const title = locale === "ar" ? post.titleAr : post.titleEn;
  const content = locale === "ar" ? post.contentAr : post.contentEn;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {post.publishedAt && (
            <time className="text-sm text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString(locale)}
            </time>
          )}
          <div className="mt-8 whitespace-pre-wrap text-foreground leading-relaxed">
            {content}
          </div>
        </article>
      </div>
    </div>
  );
}
