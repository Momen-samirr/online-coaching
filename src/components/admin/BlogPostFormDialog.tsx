"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Post = Awaited<ReturnType<typeof import("@/lib/actions/blog").getBlogPosts>>[number];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const emptyForm: {
  titleAr: string;
  titleEn: string;
  slug: string;
  contentAr: string;
  contentEn: string;
  excerptAr: string;
  excerptEn: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescriptionAr: string;
  metaDescriptionEn: string;
  status: "DRAFT" | "PUBLISHED";
} = {
  titleAr: "",
  titleEn: "",
  slug: "",
  contentAr: "",
  contentEn: "",
  excerptAr: "",
  excerptEn: "",
  metaTitleAr: "",
  metaTitleEn: "",
  metaDescriptionAr: "",
  metaDescriptionEn: "",
  status: "DRAFT",
};

export default function BlogPostFormDialog({
  open,
  onClose,
  post,
}: {
  open: boolean;
  onClose: () => void;
  post: Post | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const isEdit = !!post;

  useEffect(() => {
    if (post) {
      setForm({
        titleAr: post.titleAr,
        titleEn: post.titleEn,
        slug: post.slug,
        contentAr: post.contentAr,
        contentEn: post.contentEn,
        excerptAr: post.excerptAr ?? "",
        excerptEn: post.excerptEn ?? "",
        metaTitleAr: post.metaTitleAr ?? "",
        metaTitleEn: post.metaTitleEn ?? "",
        metaDescriptionAr: post.metaDescriptionAr ?? "",
        metaDescriptionEn: post.metaDescriptionEn ?? "",
        status: post.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [post, open]);

  const handleTitleEnChange = (titleEn: string) => {
    setForm((f) => ({
      ...f,
      titleEn,
      ...(f.slug === "" || f.slug === slugify(f.titleEn) ? { slug: slugify(titleEn) } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        excerptAr: form.excerptAr || undefined,
        excerptEn: form.excerptEn || undefined,
        metaTitleAr: form.metaTitleAr || undefined,
        metaTitleEn: form.metaTitleEn || undefined,
        metaDescriptionAr: form.metaDescriptionAr || undefined,
        metaDescriptionEn: form.metaDescriptionEn || undefined,
      };
      const result = isEdit
        ? await updateBlogPost({ ...payload, id: post!.id })
        : await createBlogPost(payload);
      if (result.success) {
        toast.success(isEdit ? "Post updated" : "Post created");
        router.refresh();
        onClose();
      } else {
        toast.error(result.error ?? "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit post" : "Add post"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title (Arabic)</Label>
              <Input
                value={form.titleAr}
                onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => handleTitleEnChange(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="lowercase-with-hyphens"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content (Arabic)</Label>
              <Textarea
                value={form.contentAr}
                onChange={(e) => setForm((f) => ({ ...f, contentAr: e.target.value }))}
                rows={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Content (English)</Label>
              <Textarea
                value={form.contentEn}
                onChange={(e) => setForm((f) => ({ ...f, contentEn: e.target.value }))}
                rows={6}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Excerpt (Arabic)</Label>
              <Textarea
                value={form.excerptAr}
                onChange={(e) => setForm((f) => ({ ...f, excerptAr: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Excerpt (English)</Label>
              <Textarea
                value={form.excerptEn}
                onChange={(e) => setForm((f) => ({ ...f, excerptEn: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meta title (Ar)</Label>
              <Input
                value={form.metaTitleAr}
                onChange={(e) => setForm((f) => ({ ...f, metaTitleAr: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Meta title (En)</Label>
              <Input
                value={form.metaTitleEn}
                onChange={(e) => setForm((f) => ({ ...f, metaTitleEn: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meta description (Ar)</Label>
              <Input
                value={form.metaDescriptionAr}
                onChange={(e) => setForm((f) => ({ ...f, metaDescriptionAr: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Meta description (En)</Label>
              <Input
                value={form.metaDescriptionEn}
                onChange={(e) => setForm((f) => ({ ...f, metaDescriptionEn: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as "DRAFT" | "PUBLISHED" }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
