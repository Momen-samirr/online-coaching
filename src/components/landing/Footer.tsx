"use client";

import Image from "next/image";
import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <div className="py-12 px-6 bg-muted/30 border-t text-center">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image src="/logo1.png" alt="logo" width={32} height={32} />
              <span className="text-muted-foreground text-sm">Coaching</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <div>
            <h4 className="font-medium mb-3">{t("product")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-foreground transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">{t("support")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">{t("legal")}</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-sm text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </div>
  );
}
