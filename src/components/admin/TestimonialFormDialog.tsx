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
import { Switch } from "../ui/switch";
import { createTestimonial, updateTestimonial } from "@/lib/actions/testimonials";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Testimonial = Awaited<ReturnType<typeof import("@/lib/actions/testimonials").getTestimonials>>[number];

const emptyForm = {
  authorNameAr: "",
  authorNameEn: "",
  contentAr: "",
  contentEn: "",
  avatarUrl: "",
  isFeatured: false,
  order: 0,
};

export default function TestimonialFormDialog({
  open,
  onClose,
  testimonial,
}: {
  open: boolean;
  onClose: () => void;
  testimonial: Testimonial | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const isEdit = !!testimonial;

  useEffect(() => {
    if (testimonial) {
      setForm({
        authorNameAr: testimonial.authorNameAr ?? "",
        authorNameEn: testimonial.authorNameEn ?? "",
        contentAr: testimonial.contentAr,
        contentEn: testimonial.contentEn,
        avatarUrl: testimonial.avatarUrl ?? "",
        isFeatured: testimonial.isFeatured,
        order: testimonial.order ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [testimonial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        authorNameAr: form.authorNameAr || undefined,
        authorNameEn: form.authorNameEn || undefined,
        contentAr: form.contentAr,
        contentEn: form.contentEn,
        avatarUrl: form.avatarUrl || undefined,
        isFeatured: form.isFeatured,
        order: form.order,
      };
      const result = isEdit
        ? await updateTestimonial({ ...payload, id: testimonial!.id })
        : await createTestimonial(payload);
      if (result.success) {
        toast.success(isEdit ? "Testimonial updated" : "Testimonial created");
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Author name (Arabic)</Label>
              <Input
                value={form.authorNameAr}
                onChange={(e) => setForm((f) => ({ ...f, authorNameAr: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Author name (English)</Label>
              <Input
                value={form.authorNameEn}
                onChange={(e) => setForm((f) => ({ ...f, authorNameEn: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content (Arabic)</Label>
              <Textarea
                value={form.contentAr}
                onChange={(e) => setForm((f) => ({ ...f, contentAr: e.target.value }))}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Content (English)</Label>
              <Textarea
                value={form.contentEn}
                onChange={(e) => setForm((f) => ({ ...f, contentEn: e.target.value }))}
                rows={4}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input
              value={form.avatarUrl}
              onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
            />
            <Label>Featured</Label>
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 0 }))}
            />
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
