"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MessageSquare, Plus, Edit, Trash2, Star } from "lucide-react";
import { getTestimonials, updateTestimonial, deleteTestimonial } from "@/lib/actions/testimonials";
import ConfirmDialog from "./ConfirmDialog";
import TestimonialFormDialog from "./TestimonialFormDialog";
import EmptyState from "./EmptyState";

type Testimonial = Awaited<ReturnType<typeof getTestimonials>>[number];

export default function TestimonialsManagement({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleFeatured = async (t: Testimonial) => {
    setTogglingId(t.id);
    try {
      const result = await updateTestimonial({
        id: t.id,
        authorNameAr: t.authorNameAr ?? undefined,
        authorNameEn: t.authorNameEn ?? undefined,
        contentAr: t.contentAr,
        contentEn: t.contentEn,
        avatarUrl: t.avatarUrl ?? undefined,
        isFeatured: !t.isFeatured,
        order: t.order ?? 0,
      });
      if (result.success) {
        toast.success(t.isFeatured ? "Removed from featured" : "Marked as featured");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to update");
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return false;
    const result = await deleteTestimonial(deleteId);
    if (result.success) {
      toast.success("Testimonial deleted");
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
              <MessageSquare className="size-5" />
              Testimonials
            </CardTitle>
            <CardDescription>Add and manage testimonials. Mark as featured for the homepage.</CardDescription>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Add testimonial
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">{t.contentEn}</p>
                  <p className="text-xs mt-2">{t.authorNameEn ?? t.authorNameAr ?? "—"}</p>
                  <div className="flex gap-2 mt-2">
                    {t.isFeatured && <Badge>Featured</Badge>}
                    <Badge variant="outline">Order: {t.order}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!!togglingId}
                    onClick={() => handleToggleFeatured(t)}
                    title={t.isFeatured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star className={`size-4 ${t.isFeatured ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditTestimonial(t)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteId(t.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {testimonials.length === 0 && (
            <EmptyState
              icon={MessageSquare}
              title="No testimonials yet"
              description="Add your first testimonial to display on the site."
            />
          )}
        </CardContent>
      </Card>
      <TestimonialFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        testimonial={null}
      />
      <TestimonialFormDialog
        open={!!editTestimonial}
        onClose={() => setEditTestimonial(null)}
        testimonial={editTestimonial}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete testimonial"
        description="This will permanently delete this testimonial."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
