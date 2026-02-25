"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 6000;

type Transformation = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string | null;
};

function SlideImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={cn("relative bg-muted overflow-hidden", className)}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-muted-foreground/10 w-full h-full" />
          <ImageIcon className="size-12 text-muted-foreground/50 absolute" aria-hidden />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center p-4">
            <ImageIcon className="size-12 mx-auto mb-2 opacity-50" aria-hidden />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          status === "loaded" ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none w-full h-full object-cover",
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        loading="lazy"
      />
    </div>
  );
}

export default function TransformationsSlider({
  transformations,
}: {
  transformations: Transformation[];
}) {
  const locale = useLocale() as "en" | "ar";
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = transformations.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      const next = ((index % count) + count) % count;
      setCurrent(next);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [count, paused]);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onFocusIn = () => setPaused(true);
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node)) setPaused(false);
    };
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  if (count === 0) return null;

  const isRtl = locale === "ar";

  return (
    <div
      ref={containerRef}
      className="relative max-w-5xl mx-auto"
      role="region"
      aria-label="Client transformations slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            goTo(current + (isRtl ? -1 : 1));
          } else if (e.key === "ArrowLeft") {
            goTo(current + (isRtl ? 1 : -1));
          }
        }}
      >
        <div
          className={cn(
            "flex transition-transform duration-500 ease-out",
            isRtl && "flex-row-reverse",
          )}
          style={{
            transform: `translateX(-${current * (100 / count)}%)`,
            width: `${count * 100}%`,
          }}
        >
          {transformations.map((t) => {
            const title = locale === "ar" ? t.titleAr : t.titleEn;
            const description =
              locale === "ar" ? t.descriptionAr : t.descriptionEn;
            return (
              <div
                key={t.id}
                className="shrink-0 flex flex-col md:flex-row items-stretch"
                style={{ width: `${100 / count}%` }}
              >
                {t.imageUrl ? (
                  <SlideImage
                    src={t.imageUrl}
                    alt={title}
                    className="h-64 md:h-auto md:min-h-[280px] md:w-1/2 shrink-0"
                  />
                ) : (
                  <div className="h-64 md:min-h-[280px] md:w-1/2 shrink-0 bg-muted flex items-center justify-center">
                    <ImageIcon className="size-12 text-muted-foreground/50" aria-hidden />
                  </div>
                )}
                <div className="flex-1 min-w-0 p-6 md:p-8 flex flex-col justify-center gap-3">
                  <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {count > 1 && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 hidden md:flex bg-background/90 backdrop-blur shadow-sm"
            aria-label="Previous transformation"
            onClick={() => goTo(current + (isRtl ? 1 : -1))}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex bg-background/90 backdrop-blur shadow-sm"
            aria-label="Next transformation"
            onClick={() => goTo(current + (isRtl ? -1 : 1))}
          >
            <ChevronRight className="size-5" />
          </Button>
          <div className="mt-4 flex justify-center gap-2">
            {transformations.map((t, index) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full border border-border transition-colors",
                  current === index ? "bg-primary border-primary" : "bg-muted",
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={current === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

