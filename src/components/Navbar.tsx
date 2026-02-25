"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { CalendarIcon, Home } from "lucide-react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + "/");
  return (
    <div className="fixed top-0 left-0 right-0 h-16 px-6 py-3 border-b border-border/50 bg-background/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src={"/logo1.png"}
              alt="Logo"
              width={33}
              height={33}
              className="w-11"
            />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 transition-colors ${isActive("/dashboard") ? "text-foreground hover:text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Home className="size-5" />
            <span className="hidden md:inline">{t("dashboard")}</span>
          </Link>
          <Link
            href="/book"
            className={`flex items-center gap-3 transition-colors ${isActive("/book") ? "text-foreground hover:text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CalendarIcon className="size-5" />
            <span className="hidden md:inline">{t("bookings")}</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.emailAddresses?.[0]?.emailAddress}
              </span>
            </div>
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
