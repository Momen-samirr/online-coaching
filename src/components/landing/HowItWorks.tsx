"use client";

import { ZapIcon } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Package, CalendarCheck, Video } from "lucide-react";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = [
    { icon: Package, title: t("step1Title"), desc: t("step1Desc") },
    { icon: CalendarCheck, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Video, title: t("step3Title"), desc: t("step3Desc") },
  ];
  return (
    <section className="relative py-32 px-6 overflow-hidden z-10 max-w-7xl mx-auto" id="how-it-works">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-3 py-3 px-5 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 backdrop-blur-sm mb-6">
          <ZapIcon className="size-5 text-primary animate-pulse" />
          <span className="text-lg font-bold text-primary">{t("badge")}</span>
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
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-y-1/2 hidden lg:block" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className="absolute w-8 h-8 -top-4 left-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm flex items-center justify-center shadow-lg">
                  <span className="font-bold">{i + 1}</span>
                </div>
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 mb-6">
                    <step.icon className="size-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </CardHeader>
                <CardContent />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
