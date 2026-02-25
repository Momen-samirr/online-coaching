"use client";

import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HeaderClient({ user }: { user: boolean }) {
  const t = useTranslations("nav");
  return (
    <>
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("home")}
        </Link>
        <Link
          href="/#choose-your-plan"
          className="text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          {t("plans")}
        </Link>
        <Link
          href="/#how-it-works"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("howItWorks")}
        </Link>
        <Link
          href="/#about"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("about")}
        </Link>
        <Link
          href="/book"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("book")}
        </Link>
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("blog")}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher className="size-8" />
        {!user ? (
          <>
            <SignUpButton mode="modal">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                {t("signUp")}
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="sm" className="cursor-pointer">
                {t("signIn")}
              </Button>
            </SignInButton>
          </>
        ) : (
          <>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                {t("dashboard")}
              </Button>
            </Link>
            <SignOutButton>
              <Button variant="default" size="sm" className="cursor-pointer">
                {t("logout")}
              </Button>
            </SignOutButton>
          </>
        )}
      </div>
    </>
  );
}
