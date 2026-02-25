"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageIcon, Plus, Edit, Trash2, Sparkles } from "lucide-react";
import { getTransformations, deleteTransformation } from "@/lib/actions/transformations";
import ConfirmDialog from "./ConfirmDialog";
import TransformationFormDialog from "./TransformationFormDialog";
import EmptyState from "./EmptyState";

type Transformation = Awaited<
  ReturnType<typeof getTransformations>
>[number];

export default function TransformationsManagement({
  transformations,
}: {
  transformations: Transformation[];
}) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Transformation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return false;
    const result = await deleteTransformation(deleteId);
    if (result.success) {
      toast.success("Transformation deleted");
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
              <Sparkles className="size-5" />
              Transformations
            </CardTitle>
            <CardDescription>
              Add and manage client transformations shown on the homepage slider.
            </CardDescription>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Add transformation
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transformations.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {t.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.imageUrl}
                        alt={t.titleEn}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium truncate">{t.titleEn}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {t.descriptionEn}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant={t.isActive ? "default" : "outline"}>
                        {t.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">Order: {t.order}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditItem(t)}
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
          {transformations.length === 0 && (
            <EmptyState
              icon={Sparkles}
              title="No transformations yet"
              description="Add transformations to showcase your clients' progress on the homepage slider."
            />
          )}
        </CardContent>
      </Card>
      <TransformationFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        transformation={null}
      />
      <TransformationFormDialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        transformation={editItem}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete transformation"
        description="This will permanently delete this transformation."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

