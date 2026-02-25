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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { PlanType, Plan } from "@prisma/client";
import { toast } from "sonner";
import { useUpdatePlan } from "@/hooks/use-plans";
import CloudinaryImageUpload from "./CloudinaryImageUpload";

interface EditPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export default function EditPlanDialog({
  isOpen,
  onClose,
  plan,
}: EditPlanDialogProps) {
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState<PlanType>("ONE_TIME");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const updateMutation = useUpdatePlan();

  useEffect(() => {
    if (plan) {
      setTitleAr(plan.titleAr);
      setTitleEn(plan.titleEn);
      setDescriptionAr(plan.descriptionAr);
      setDescriptionEn(plan.descriptionEn);
      setPrice(Number(plan.price).toString());
      setDuration(plan.duration);
      setType(plan.type);
      setIsActive(plan.isActive);
      setImageUrl(plan.imageUrl ?? "");
    }
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || !titleAr || !titleEn || !descriptionAr || !descriptionEn || !duration) return;
    updateMutation.mutate(
      {
        id: plan.id,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        price: numPrice,
        duration,
        type,
        isActive,
        imageUrl: imageUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Plan updated");
          onClose();
        },
        onError: (err) => toast.error(err?.message ?? "Failed to update plan"),
      }
    );
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title (Arabic)</Label>
              <Input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Description (Arabic)</Label>
              <Textarea
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                required
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (English)</Label>
              <Textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                required
                rows={3}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as PlanType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONE_TIME">One-time</SelectItem>
                <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Active</Label>
          </div>
          <CloudinaryImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="plans"
            label="Plan image (optional)"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
