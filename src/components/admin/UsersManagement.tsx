"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { setUserSuspended } from "@/lib/actions/users";
import { User, UserX } from "lucide-react";
import EmptyState from "./EmptyState";

type UserWithCount = Awaited<ReturnType<typeof import("@/lib/actions/users").getUsers>>[number];

export default function UsersManagement({ users }: { users: UserWithCount[] }) {
  const router = useRouter();
  const [updating, setUpdating] = React.useState<string | null>(null);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Users
        </CardTitle>
        <CardDescription>View and manage users. Suspend access if needed.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{user._count.bookings} sessions</Badge>
                  <Badge variant="outline">{user._count.subscriptions} subscriptions</Badge>
                  {user.isSuspended && <Badge variant="destructive">Suspended</Badge>}
                </div>
              </div>
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
    </Card>
  );
}
