import React from "react";
import { getSettings } from "@/lib/actions/settings";
import { getTranslations } from "next-intl/server";

export default async function ContactSection() {
  const settings = await getSettings();
  const t = await getTranslations("contact");
  return (
    <section className="relative py-20 md:py-24 px-6" id="contact">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
        <p className="text-muted-foreground mb-8">{t("subtitle")}</p>
        <div className="space-y-2 text-left">
          <p>
            <span className="font-medium">{t("email")}: </span>
            <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">
              {settings.contactEmail}
            </a>
          </p>
          {settings.contactPhone && (
            <p>
              <span className="font-medium">{t("phone")}: </span>
              <a href={`tel:${settings.contactPhone}`} className="text-primary hover:underline">
                {settings.contactPhone}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
