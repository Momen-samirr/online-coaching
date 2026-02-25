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
import {
  createTransformation,
  updateTransformation,
} from "@/lib/actions/transformations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CloudinaryImageUpload from "./CloudinaryImageUpload";

type Transformation = Awaited<
  ReturnType<typeof import("@/lib/actions/transformations").getTransformations>
>[number];

const emptyForm = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  imageUrl: "",
  isActive: true,
  order: 0,
};

export default function TransformationFormDialog({
  open,
  onClose,
  transformation,
}: {
  open: boolean;
  onClose: () => void;
  transformation: Transformation | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const isEdit = !!transformation;

  useEffect(() => {
    if (transformation) {
      setForm({
        titleAr: transformation.titleAr,
        titleEn: transformation.titleEn,
        descriptionAr: transformation.descriptionAr,
        descriptionEn: transformation.descriptionEn,
        imageUrl: transformation.imageUrl ?? "",
        isActive: transformation.isActive,
        order: transformation.order ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [transformation, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        titleAr: form.titleAr,
        titleEn: form.titleEn,
        descriptionAr: form.descriptionAr,
        descriptionEn: form.descriptionEn,
        imageUrl: form.imageUrl || undefined,
        isActive: form.isActive,
        order: form.order,
      };
      const result = isEdit
        ? await updateTransformation({ ...payload, id: transformation!.id })
        : await createTransformation(payload);
      if (result.success) {
        toast.success(isEdit ? "Transformation updated" : "Transformation created");
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
          <DialogTitle>{isEdit ? "Edit transformation" : "Add transformation"}</DialogTitle>
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
                onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Description (Arabic)</Label>
              <Textarea
                value={form.descriptionAr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descriptionAr: e.target.value }))
                }
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description (English)</Label>
              <Textarea
                value={form.descriptionEn}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descriptionEn: e.target.value }))
                }
                rows={4}
                required
              />
            </div>
          </div>
          <CloudinaryImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            folder="transformations"
            label="Image (optional)"
          />
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
            <Label>Active</Label>
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  order: Number.isNaN(parseInt(e.target.value, 10))
                    ? 0
                    : parseInt(e.target.value, 10),
                }))
              }
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

