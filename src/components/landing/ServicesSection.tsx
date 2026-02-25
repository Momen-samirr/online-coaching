import React from "react";
import { getActivePlans } from "@/lib/actions/plans";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedPlanField } from "@/lib/utils";
import type { Locale } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default async function ServicesSection() {
  const plans = await getActivePlans();
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("services");

  return (
    <section className="relative py-24 px-6" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {plans.map((plan) => (
            <Card key={plan.id} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {getLocalizedPlanField(plan, "title", locale)}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {getLocalizedPlanField(plan, "description", locale)}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">{Number(plan.price)} EGP</span>
                  <span className="text-sm text-muted-foreground">{plan.duration}</span>
                </div>
                <Link href={`/book?plan=${plan.id}`}>
                  <Button className="w-full">{t("bookNow")}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {plans.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No plans available at the moment.</p>
        )}
      </div>
    </section>
  );
}
