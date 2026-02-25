"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const LOCALES = ["en", "ar"] as const;

export default function LocaleDir() {
  const pathname = usePathname();
  useEffect(() => {
    const segment = pathname.split("/")[1];
    const locale = LOCALES.includes(segment as (typeof LOCALES)[number])
      ? segment
      : "en";
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [pathname]);
  return null;
}
