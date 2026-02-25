"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/users", labelKey: "users", icon: Users },
  { href: "/admin/plans", labelKey: "plans", icon: Package },
  { href: "/admin/bookings", labelKey: "bookings", icon: Calendar },
  { href: "/admin/transformations", labelKey: "transformations", icon: Sparkles },
  { href: "/admin/payments", labelKey: "payments", icon: CreditCard },
  { href: "/admin/blog", labelKey: "blog", icon: FileText },
  { href: "/admin/testimonials", labelKey: "testimonials", icon: MessageSquare },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
];

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  plans: "Plans",
  bookings: "Sessions",
  transformations: "Transformations",
  payments: "Payments",
  blog: "Blog",
  testimonials: "Testimonials",
  settings: "Settings",
};

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const base = `/${locale}/admin`;
  const isActive = (href: string) => {
    const path = href === "/admin" ? base : `${base}${href.replace("/admin", "")}`;
    return pathname === path || (href !== "/admin" && pathname?.startsWith(path));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-border/50 bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href={`/${locale}`} className="font-semibold">
          Coaching Admin
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const href = item.href === "/admin" ? base : `${base}${item.href.replace("/admin", "")}`;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              {labels[item.labelKey]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
