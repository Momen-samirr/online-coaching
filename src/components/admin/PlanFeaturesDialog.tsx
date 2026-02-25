"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  getPlanFeatures,
  createPlanFeature,
  updatePlanFeature,
  deletePlanFeature,
} from "@/lib/actions/planFeatures";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ListChecks, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

type PlanFeature = Awaited<ReturnType<typeof getPlanFeatures>>[number];

export default function PlanFeaturesDialog({
  open,
  onClose,
  plan,
}: {
  open: boolean;
  onClose: () => void;
  plan: { id: string; titleEn: string } | null;
}) {
  const router = useRouter();
  const [features, setFeatures] = useState<PlanFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ titleAr: "", titleEn: "", order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ titleAr: "", titleEn: "", order: 0 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !plan) return;
    setLoading(true);
    getPlanFeatures(plan.id)
      .then(setFeatures)
      .catch(() => toast.error("Failed to load features"))
      .finally(() => setLoading(false));
  }, [open, plan?.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setSaving(true);
    try {
      const result = await createPlanFeature({
        planId: plan.id,
        titleAr: addForm.titleAr,
        titleEn: addForm.titleEn,
        order: addForm.order,
      });
      if (result.success) {
        toast.success("Feature added");
        const next = await getPlanFeatures(plan.id);
        setFeatures(next);
        setAddForm({ titleAr: "", titleEn: "", order: 0 });
        setAdding(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (f: PlanFeature) => {
    setEditingId(f.id);
    setEditForm({ titleAr: f.titleAr, titleEn: f.titleEn, order: f.order });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      const result = await updatePlanFeature({
        id: editingId,
        titleAr: editForm.titleAr,
        titleEn: editForm.titleEn,
        order: editForm.order,
      });
      if (result.success) {
        toast.success("Feature updated");
        if (plan) {
          const next = await getPlanFeatures(plan.id);
          setFeatures(next);
        }
        setEditingId(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return false;
    const result = await deletePlanFeature(deleteId);
    if (result.success) {
      toast.success("Feature deleted");
      if (plan) {
        const next = await getPlanFeatures(plan.id);
        setFeatures(next);
      }
      setDeleteId(null);
      router.refresh();
      return true;
    }
    toast.error(result.error ?? "Failed to delete");
    return false;
  };

  if (!plan) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="size-5" />
              Features: {plan.titleEn}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {!adding ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAdding(true)}
                  >
                    <Plus className="size-4 mr-1.5" />
                    Add feature
                  </Button>
                ) : (
                  <form
                    onSubmit={handleAdd}
                    className="rounded-lg border p-4 space-y-3 bg-muted/30"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Title (Arabic)</Label>
                        <Input
                          value={addForm.titleAr}
                          onChange={(e) =>
                            setAddForm((f) => ({ ...f, titleAr: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Title (English)</Label>
                        <Input
                          value={addForm.titleEn}
                          onChange={(e) =>
                            setAddForm((f) => ({ ...f, titleEn: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="space-y-1.5 w-24">
                        <Label>Order</Label>
                        <Input
                          type="number"
                          min={0}
                          value={addForm.order}
                          onChange={(e) =>
                            setAddForm((f) => ({
                              ...f,
                              order: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-end">
                        <Button type="submit" disabled={saving} size="sm">
                          {saving ? "..." : "Add"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAdding(false);
                            setAddForm({ titleAr: "", titleEn: "", order: 0 });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
                <ul className="space-y-2">
                  {features.map((f) =>
                    editingId === f.id ? (
                      <li key={f.id} className="rounded-lg border p-3 bg-muted/20">
                        <form onSubmit={handleUpdate} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label>Title (Arabic)</Label>
                              <Input
                                value={editForm.titleAr}
                                onChange={(e) =>
                                  setEditForm((x) => ({ ...x, titleAr: e.target.value }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label>Title (English)</Label>
                              <Input
                                value={editForm.titleEn}
                                onChange={(e) =>
                                  setEditForm((x) => ({ ...x, titleEn: e.target.value }))
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              min={0}
                              className="w-20"
                              value={editForm.order}
                              onChange={(e) =>
                                setEditForm((x) => ({
                                  ...x,
                                  order: parseInt(e.target.value, 10) || 0,
                                }))
                              }
                            />
                            <Button type="submit" disabled={saving} size="sm">
                              {saving ? "..." : "Save"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </li>
                    ) : (
                      <li
                        key={f.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <span className="font-medium">{f.titleEn}</span>
                          {f.titleAr && (
                            <span className="text-muted-foreground text-sm ml-2">
                              {f.titleAr}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground ml-2">
                            (order: {f.order})
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(f)}
                            aria-label="Edit feature"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(f.id)}
                            aria-label="Delete feature"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </li>
                    )
                  )}
                </ul>
                {features.length === 0 && !adding && (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No features yet. Add features to describe what this plan includes.
                  </p>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete feature"
        description="This feature will be removed from the plan."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
