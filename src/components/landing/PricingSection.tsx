import React from "react";
import { getActivePlansWithFeatures } from "@/lib/actions/plans";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedPlanField } from "@/lib/utils";
import type { Locale } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Check } from "lucide-react";

export default async function PricingSection() {
  const plans = await getActivePlansWithFeatures();
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pricing");

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-background via-muted/3 to-background" id="pricing">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-primary/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_50%,#000_50%,transparent_85%)] opacity-20" />
        </div>
      </div>
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/5 to-primary/10 px-5 py-3 rounded-full border border-primary/10 backdrop-blur-sm mb-6">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-bold">{t("badge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("title1")}
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("title2")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-xl">
            {t("subtitle")}
          </p>
        </div>
        <div className={`grid gap-8 max-w-6xl mx-auto ${plans.length <= 2 ? "md:grid-cols-2" : "lg:grid-cols-3"}`}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20"
            >
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">
                  {getLocalizedPlanField(plan, "title", locale)}
                </h3>
                <p className="text-muted-foreground mb-4 min-h-[60px]">
                  {getLocalizedPlanField(plan, "description", locale)}
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">{Number(plan.price)}</span>
                  <span className="text-muted-foreground">
                    EGP {plan.type === "SUBSCRIPTION" ? t("perMonth") : t("perSession")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.duration}</p>
                {plan.features.length > 0 && (
                  <ul className="space-y-2 mb-6" aria-label="Plan features">
                    {plan.features.map((f) => (
                      <li key={f.id} className="flex items-start gap-2 text-sm">
                        <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                        <span>{locale === "ar" ? f.titleAr : f.titleEn}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={plan.type === "SUBSCRIPTION" ? `/plans` : `/book?plan=${plan.id}`}>
                  <Button className="w-full transition-colors" size="lg">
                    {plan.type === "SUBSCRIPTION" ? "View Plans" : "Book Now"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {plans.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No plans available.</p>
        )}
      </div>
    </section>
  );
}
