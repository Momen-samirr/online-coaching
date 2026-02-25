import { getActivePlansWithFeatures } from "@/lib/actions/plans";
import { getTranslations, getLocale } from "next-intl/server";
import { getLocalizedPlanField } from "@/lib/utils";
import type { Locale } from "@/lib/utils";
import Header from "@/components/landing/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import PlanCardActions from "./PlanCardActions";

export default async function PlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const plans = await getActivePlansWithFeatures();
  const t = await getTranslations("pricing");
  const loc = (await getLocale()) as Locale;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {t("title1")} {t("title2")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2"
              >
                {plan.imageUrl ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={plan.imageUrl}
                      alt={getLocalizedPlanField(plan, "title", loc)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <CardContent className="p-6 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {getLocalizedPlanField(plan, "title", loc)}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {getLocalizedPlanField(plan, "description", loc)}
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">{Number(plan.price)}</span>
                    <span className="text-muted-foreground">
                      EGP {plan.type === "SUBSCRIPTION" ? t("perMonth") : t("perSession")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.duration}</p>
                  {plan.features.length > 0 && (
                    <ul className="space-y-2 mb-6 flex-1" aria-label="Plan features">
                      {plan.features.map((f) => (
                        <li
                          key={f.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                          <span>
                            {loc === "ar" ? f.titleAr : f.titleEn}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <PlanCardActions
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
      </div>
    </div>
  );
}
