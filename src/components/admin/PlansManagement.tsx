"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useGetPlans, useDeletePlan } from "@/hooks/use-plans";
import { Plan } from "@prisma/client";
import { toast } from "sonner";
import { Edit, Plus, Trash2, ListChecks } from "lucide-react";
import AddPlanDialog from "./AddPlanDialog";
import EditPlanDialog from "./EditPlanDialog";
import PlanFeaturesDialog from "./PlanFeaturesDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function PlansManagement() {
  const { data: plans = [] } = useGetPlans();
  const deletePlan = useDeletePlan();
  const [addOpen, setAddOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featuresPlan, setFeaturesPlan] = useState<{ id: string; titleEn: string } | null>(null);

  return (
    <>
      <Card className="mb-12">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plans Management</CardTitle>
            <CardDescription>Create and manage coaching plans</CardDescription>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Add Plan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No plans yet. Add your first plan.
              </p>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div>
                    <div className="font-semibold">{plan.titleEn}</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.titleAr}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        {Number(plan.price)} EGP
                      </Badge>
                      <Badge variant="outline">{plan.duration}</Badge>
                      <Badge variant={plan.type === "SUBSCRIPTION" ? "default" : "secondary"}>
                        {plan.type}
                      </Badge>
                      {!plan.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFeaturesPlan({ id: plan.id, titleEn: plan.titleEn })}
                      title="Manage features"
                    >
                      <ListChecks className="size-4 mr-1" />
                      Features
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditPlan(plan)}
                      aria-label="Edit plan"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(plan.id)}
                      aria-label="Delete plan"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <AddPlanDialog isOpen={addOpen} onClose={() => setAddOpen(false)} />
      <EditPlanDialog
        isOpen={!!editPlan}
        onClose={() => setEditPlan(null)}
        plan={editPlan}
      />
      <PlanFeaturesDialog
        open={!!featuresPlan}
        onClose={() => setFeaturesPlan(null)}
        plan={featuresPlan}
      />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this plan. Existing bookings will not
              be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                if (deleteId) {
                  deletePlan.mutate(deleteId, {
                    onSuccess: () => {
                      toast.success("Plan deleted");
                      setDeleteId(null);
                    },
                    onError: (err) => toast.error(err?.message ?? "Failed to delete plan"),
                  });
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
