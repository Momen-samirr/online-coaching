import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { CalendarCheck } from "lucide-react";

export default async function SessionsSection() {
  const t = await getTranslations("sessions");

  return (
    <section
      className="relative py-16 md:py-20 px-6 border-t border-border/50 bg-muted/20"
      id="sessions"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>
          </div>
          <Link href="/book" className="shrink-0">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CalendarCheck className="size-4" />
              {t("cta")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
