"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { startPlanCheckout } from "@/lib/actions/subscriptions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { PlanType } from "@prisma/client";

export default function PlanCardActions({
  planId,
  planType,
  locale,
}: {
  planId: string;
  planType: PlanType;
  locale: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuyPlan = async () => {
    setLoading(true);
    try {
      const result = await startPlanCheckout(planId);
      if (result.success && result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl;
        return;
      }
      if (!result.success && result.error?.toLowerCase().includes("auth")) {
        const redirectUrl = `/${locale}/plans`;
        router.push(`/${locale}?redirect_url=${encodeURIComponent(redirectUrl)}`);
        toast.error("Please sign in to purchase a plan");
        return;
      }
      if (!result.success) {
        toast.error(result.error ?? "Failed to start checkout");
      }
    } finally {
      setLoading(false);
    }
  };

  if (planType === "ONE_TIME") {
    return (
      <Link href={`/book?plan=${planId}`} className="block">
        <Button className="w-full transition-colors" size="lg" aria-label="Book a session for this plan">
          Book a session
        </Button>
      </Link>
    );
  }

  return (
    <Button
      className="w-full transition-colors"
      size="lg"
      onClick={handleBuyPlan}
      disabled={loading}
      aria-label={loading ? "Processing…" : "Buy this plan"}
      aria-busy={loading}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        "Buy Plan"
      )}
    </Button>
  );
}
