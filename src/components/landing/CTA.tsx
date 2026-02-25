"use client";

import React from "react";
import { Button } from "../ui/button";
import { Package } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations("cta");
  return (
    <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-muted/10 via-background to-muted/5 sm:text-center text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.03),transparent_70%)]" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t("headline1")}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t("headline2")}
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("subtitle")}
            </p>
            <Link href="/#choose-your-plan">
              <Button
                size="lg"
                className="rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Package className="size-5 mr-1.5" />
                {t("button")}
              </Button>
            </Link>
          </div>
          <div className="relative flex justify-center">
            <Image
              src="/Fitnees-removebg-preview.png"
              alt=""
              width={300}
              height={300}
              className="w-100 h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
