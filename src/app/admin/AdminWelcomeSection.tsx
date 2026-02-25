import { useUser } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import React from "react";

const AdminWelcomeSection = () => {
  const { user } = useUser();
  return (
    <div className="mb-13 flex items-center justify-between bg-linear-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-3 bg-linear-to-r from-primary/5 to-primary/10 px-3 py-1 rounded-full border border-primary/10">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-sm font-medium">
            Admin Dashboard
          </span>
        </div>
        <h2 className="text-4xl font-bold mb-3">
          Welcome Back, {user?.firstName} !
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Manage plans, sessions, payments, and your coaching platform.
        </p>
      </div>
      <div className="hidden bg-linear-to-br from-primary/20 to-primary/10 rounded-full w-33 h-33 md:flex items-center justify-center">
        <Settings className="size-16 text-primary" />
      </div>
    </div>
  );
};

export default AdminWelcomeSection;
