import React from "react";
import { getSettings } from "@/lib/actions/settings";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedSettingsField } from "@/lib/utils";
import type { Locale } from "@/lib/utils";

export default async function AboutSection() {
  const settings = await getSettings();
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("about");
  const bio = getLocalizedSettingsField(settings, "bio", locale) || t("bio");
  const experienceYears = settings.experienceYears ?? 0;
  const certifications = settings.certifications ?? "";

  return (
    <section className="relative py-20 md:py-24 px-6 bg-muted/20" id="about">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("title")}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">{bio}</p>
        {experienceYears > 0 && (
          <p className="text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">{experienceYears}</span> {t("experience")}
          </p>
        )}
        {certifications && (
          <>
            <p className="font-medium text-foreground mt-4">{t("certifications")}</p>
            <p className="text-sm text-muted-foreground">{certifications}</p>
          </>
        )}
      </div>
    </section>
  );
}
