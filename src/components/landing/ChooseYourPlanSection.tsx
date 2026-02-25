import React from "react";
import { getActivePlansWithFeatures } from "@/lib/actions/plans";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedPlanField } from "@/lib/utils";
import type { Locale } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Check } from "lucide-react";
import PlanCardBuyButton from "./PlanCardBuyButton";

export default async function ChooseYourPlanSection() {
  const plans = await getActivePlansWithFeatures();
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pricing");
  const cardClassName =
    "group border-border/60 hover:border-primary/40 bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2";
  return (
    <section
      className="relative py-24 md:py-32 px-6 overflow-hidden"
      id="choose-your-plan"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_50%,#000_40%,transparent_90%)] opacity-15" />
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
              {t("chooseYourPlan")}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div
          className={`grid gap-6 md:gap-8 max-w-6xl mx-auto ${
            plans.length <= 2
              ? "md:grid-cols-2"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`${cardClassName} ${index === 1 ? "scale-110" : ""}`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {plan.imageUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={plan.imageUrl}
                    alt={getLocalizedPlanField(plan, "title", locale)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2 transition-colors group-hover:text-primary/90">
                  {getLocalizedPlanField(plan, "title", locale)}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                  {getLocalizedPlanField(plan, "description", locale)}
                </p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold tabular-nums">
                    {Number(plan.price)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    EGP{" "}
                    {plan.type === "SUBSCRIPTION"
                      ? t("perMonth")
                      : t("perSession")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {plan.duration}
                </p>
                {plan.features.length > 0 && (
                  <ul className="space-y-2 mb-6" aria-label="Plan features">
                    {plan.features.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check
                          className="size-4 text-primary shrink-0 mt-0.5"
                          aria-hidden
                        />
                        <span>{locale === "ar" ? f.titleAr : f.titleEn}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <PlanCardBuyButton
                  planId={plan.id}
                  planType={plan.type}
                  locale={locale}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        {plans.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No plans available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}
