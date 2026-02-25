"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

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

function AdminSidebarContent({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations("admin");
  const base = `/${locale}/admin`;

  const isActive = (href: string) => {
    const path = href === "/admin" ? base : `${base}${href.replace("/admin", "")}`;
    return pathname === path || (href !== "/admin" && pathname?.startsWith(path));
  };

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 rounded-md px-2 py-2 font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <span className="truncate">Coaching Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const href = item.href === "/admin" ? base : `${base}${item.href.replace("/admin", "")}`;
                const Icon = item.icon;
                const label = t(item.labelKey);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={label}
                    >
                      <Link href={href}>
                        <Icon className="size-5 shrink-0" />
                        <span className="truncate">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

function AdminHeader({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
      <div className="flex flex-1 items-center gap-4" />
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <UserButton
          afterSignOutUrl={`/${locale}`}
          appearance={{ elements: { avatarBox: "size-8" } }}
        />
      </div>
    </header>
  );
}

function getSidebarInitialState(): boolean {
  if (typeof document === "undefined") return true;
  const match = document.cookie.match(new RegExp(`${SIDEBAR_COOKIE_NAME}=(\\w+)`));
  return match ? match[1] === "true" : true;
}

export default function AdminLayoutClient({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const [defaultOpen, setDefaultOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setDefaultOpen(getSidebarInitialState());
  }, []);

  if (defaultOpen === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon" side="left" className="border-r border-sidebar-border">
        <AdminSidebarContent locale={locale} />
      </Sidebar>
      <SidebarInset>
        <AdminHeader locale={locale} />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
