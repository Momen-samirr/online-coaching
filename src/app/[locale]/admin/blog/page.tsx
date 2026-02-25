import { getBlogPosts } from "@/lib/actions/blog";
import BlogManagement from "@/components/admin/BlogManagement";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts(true);
  return <BlogManagement posts={posts} />;
}
