"use client";

import { SignUpButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import { BookCheck, Star } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const Hero = () => {
  const t = useTranslations("hero");
  const stars = [1, 2, 3, 4, 5];
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      id="hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      </div>
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/15 to-primary/5 rounded-full blur-3xl" />
      <div className="relative z-10 w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
                  <div className="size-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    {t("badge")}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-gradient-to-br from-card-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("headline1")}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("headline2")}
                  </span>
                  <br />
                  <span className="bg-gradient-to-br from-card-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("headline3")}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-medium">
                  {t("subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link href="/#choose-your-plan">
                    <Button
                      size="lg"
                      className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <BookCheck className="size-5 mr-3" />
                      {t("ctaPrimary")}
                    </Button>
                  </Link>
                  <SignUpButton mode="modal">
                    <Button
                      size="lg"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      {t("ctaSecondary")}
                    </Button>
                  </SignUpButton>
                </div>
                <div className="pt-8 flex items-center gap-6">
                  <div className="flex gap-1">
                    {stars.map((i) => (
                      <Star
                        key={i}
                        className="size-5 fill-amber-300 text-amber-300"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("trustedBy")}{" "}
                    <span className="font-semibold text-foreground">
                      1,200+ {t("users")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="relative lg:pl-8 flex justify-center">
              <Image
                src="/Fitnees-removebg-preview.png"
                alt="Coaching"
                width={400}
                height={400}
                className="w-auto h-auto max-h-[600px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
