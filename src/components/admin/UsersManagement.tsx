"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { setUserSuspended, updateUserRole } from "@/lib/actions/users";
import { User, UserX } from "lucide-react";
import type { UserRole } from "@prisma/client";
import EmptyState from "./EmptyState";
import ConfirmDialog from "./ConfirmDialog";

type UserWithCount = Awaited<ReturnType<typeof import("@/lib/actions/users").getUsers>>[number];

export default function UsersManagement({ users }: { users: UserWithCount[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [roleConfirm, setRoleConfirm] = useState<{
    userId: string;
    email: string;
    newRole: UserRole;
  } | null>(null);

  const handleToggleSuspend = async (userId: string, current: boolean) => {
    setUpdating(userId);
    try {
      const result = await setUserSuspended(userId, !current);
      if (result.success) {
        toast.success(current ? "User unsuspended" : "User suspended");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to update user");
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleSelect = (userId: string, currentRole: UserRole, newRole: UserRole) => {
    if (newRole === currentRole) return;
    const user = users.find((u) => u.id === userId);
    setRoleConfirm({ userId, email: user?.email ?? "", newRole });
  };

  const handleConfirmRoleChange = async () => {
    if (!roleConfirm) return;
    setUpdating(roleConfirm.userId);
    try {
      const result = await updateUserRole(roleConfirm.userId, roleConfirm.newRole);
      if (result.success) {
        toast.success(`Role updated to ${roleConfirm.newRole}`);
        setRoleConfirm(null);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to update role");
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Users
        </CardTitle>
        <CardDescription>
          View and manage users. Change roles or suspend access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                  <Badge variant="outline">{user._count.bookings} sessions</Badge>
                  <Badge variant="outline">{user._count.subscriptions} subscriptions</Badge>
                  {user.isSuspended && <Badge variant="destructive">Suspended</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Select
                  value={user.role}
                  onValueChange={(value) =>
                    handleRoleSelect(user.id, user.role, value as UserRole)
                  }
                  disabled={!!updating}
                >
                  <SelectTrigger className="w-[7rem]" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={user.isSuspended ? "default" : "destructive"}
                  size="sm"
                  disabled={!!updating}
                  onClick={() => handleToggleSuspend(user.id, user.isSuspended)}
                >
                  <UserX className="size-4 mr-1" />
                  {user.isSuspended ? "Unsuspend" : "Suspend"}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {users.length === 0 && (
          <EmptyState
            icon={User}
            title="No users yet"
            description="Users will appear here once they sign up."
          />
        )}
      </CardContent>

      <ConfirmDialog
        open={!!roleConfirm}
        onOpenChange={(open) => !open && setRoleConfirm(null)}
        title="Change user role?"
        description={
          roleConfirm
            ? `Change role to ${roleConfirm.newRole} for ${roleConfirm.email}. ${
                roleConfirm.newRole === "ADMIN"
                  ? "This will grant full admin access."
                  : "This will revoke admin access."
              }`
            : ""
        }
        confirmLabel="Change role"
        onConfirm={handleConfirmRoleChange}
        loading={updating !== null}
      />
    </Card>
  );
}
