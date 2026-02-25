import { getBlogPosts } from "@/lib/actions/blog";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/landing/Header";

export default async function BlogListPage() {
  const posts = await getBlogPosts(false);
  const locale = (await getLocale()) as "en" | "ar";
  const t = await getTranslations("nav");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">{t("blog")}</h1>
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block group">
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {locale === "ar" ? post.titleAr : post.titleEn}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === "ar" ? post.excerptAr : post.excerptEn}
                  </p>
                  <time className="text-xs text-muted-foreground">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString(locale)
                      : ""}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
          {posts.length === 0 && (
            <p className="text-muted-foreground">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
