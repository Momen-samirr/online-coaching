"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AdminWelcomeSection from "./AdminWelcomeSection";
import AdminStatus from "@/components/admin/AdminStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, FileText, CreditCard, MessageSquare, Package, Settings, Users } from "lucide-react";

export type AdminDashboardStats = {
  totalUsers: number;
  totalPayments: number;
  revenue: number;
  blogCount: number;
  testimonialsCount: number;
  totalPlans: number;
  activePlans: number;
  totalBookings: number;
  confirmedBookings: number;
};

export default function AdminDashboardClient({
  locale,
  stats,
}: {
  locale: string;
  stats: AdminDashboardStats;
}) {
  const t = useTranslations("admin");
  const base = `/${locale}/admin`;
  return (
    <div className="space-y-8">
      <AdminWelcomeSection />
      <AdminStatus
        totalPlans={stats.totalPlans}
        activePlans={stats.activePlans}
        totalBookings={stats.totalBookings}
        confirmedBookings={stats.confirmedBookings}
        totalUsers={stats.totalUsers}
        totalPayments={stats.totalPayments}
        revenue={stats.revenue}
        blogCount={stats.blogCount}
        testimonialsCount={stats.testimonialsCount}
      />
      <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
        <CardHeader>
          <h2 className="text-lg font-semibold">{t("quickLinks")}</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="focus-visible:ring-2" asChild>
              <Link href={`${base}/plans`}>
                <Package className="size-4 mr-1.5 shrink-0" aria-hidden />
                {t("managePlans")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="focus-visible:ring-2" asChild>
              <Link href={`${base}/bookings`}>
                <Calendar className="size-4 mr-1.5 shrink-0" aria-hidden />
                {t("viewBookings")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="focus-visible:ring-2" asChild>
              <Link href={`${base}/payments`}>
                <CreditCard className="size-4 mr-1.5 shrink-0" aria-hidden />
                {t("payments")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="focus-visible:ring-2" asChild>
              <Link href={`${base}/blog`}>
                <FileText className="size-4 mr-1.5 shrink-0" aria-hidden />
                {t("blog")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="focus-visible:ring-2" asChild>
              <Link href={`${base}/testimonials`}>
                <MessageSquare className="size-4 mr-1.5 shrink-0" aria-hidden />
                {t("testimonials")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="focus-visible:ring-2" asChild>
              <Link href={`${base}/users`}>
                <Users className="size-4 mr-1.5 shrink-0" aria-hidden />
                {t("users")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="focus-visible:ring-2" asChild>
              <Link href={`${base}/settings`}>
                <Settings className="size-4 mr-1.5 shrink-0" aria-hidden />
                {t("settings")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
