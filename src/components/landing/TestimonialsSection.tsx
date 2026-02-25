import React from "react";
import { getTestimonials } from "@/lib/actions/testimonials";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  const locale = (await getLocale()) as "en" | "ar";
  const t = await getTranslations("testimonials");

  return (
    <section className="relative py-20 md:py-24 px-6" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl border border-border/50 bg-card transition-shadow duration-200 hover:shadow-md"
            >
              {item.avatarUrl && (
                <Image
                  src={item.avatarUrl}
                  alt={locale === "ar" ? item.authorNameAr ?? "" : item.authorNameEn ?? ""}
                  width={48}
                  height={48}
                  className="rounded-full mb-4"
                />
              )}
              <p className="text-muted-foreground italic mb-4">
                {locale === "ar" ? item.contentAr : item.contentEn}
              </p>
              <p className="font-medium text-sm">
                {locale === "ar" ? item.authorNameAr : item.authorNameEn}
              </p>
            </div>
          ))}
        </div>
        {testimonials.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No testimonials yet.</p>
        )}
      </div>
    </section>
  );
}
