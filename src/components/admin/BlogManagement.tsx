"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { getBlogPosts, deleteBlogPost } from "@/lib/actions/blog";
import ConfirmDialog from "./ConfirmDialog";
import BlogPostFormDialog from "./BlogPostFormDialog";
import EmptyState from "./EmptyState";

type Post = Awaited<ReturnType<typeof getBlogPosts>>[number];

export default function BlogManagement({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deletePostId) return false;
    const result = await deleteBlogPost(deletePostId);
    if (result.success) {
      toast.success("Post deleted");
      router.refresh();
      return true;
    }
    toast.error(result.error ?? "Failed to delete");
    return false;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Blog
            </CardTitle>
            <CardDescription>Create and manage blog posts. Draft or publish.</CardDescription>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Add post
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{post.titleEn}</p>
                  <p className="text-sm text-muted-foreground">/{post.slug}</p>
                  <Badge
                    variant={post.status === "PUBLISHED" ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {post.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditPost(post)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeletePostId(post.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {posts.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No posts yet"
              description="Add your first blog post to get started."
            />
          )}
        </CardContent>
      </Card>
      <BlogPostFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        post={null}
      />
      <BlogPostFormDialog
        open={!!editPost}
        onClose={() => setEditPost(null)}
        post={editPost}
      />
      <ConfirmDialog
        open={!!deletePostId}
        onOpenChange={(open) => !open && setDeletePostId(null)}
        title="Delete post"
        description="This will permanently delete this blog post. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
