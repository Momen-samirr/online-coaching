"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Plan } from "@prisma/client";
import { getLocalizedPlanField } from "@/lib/utils";
import type { Locale } from "@/lib/utils";
import { createBooking } from "@/lib/actions/bookings";
import { initiatePayment } from "@/lib/actions/payments";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export default function BookingFlow({
  plans,
  preselectedPlanId,
  userId,
  billingData,
}: {
  plans: Plan[];
  preselectedPlanId: string | null;
  userId: string;
  billingData: { firstName: string; lastName: string; email: string; phone?: string };
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("booking");
  const [step, setStep] = useState(1);
  const [planId, setPlanId] = useState<string | null>(preselectedPlanId ?? (plans[0]?.id ?? null));
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === planId);

  const handleConfirm = async () => {
    if (!planId || !date || !time || !selectedPlan) return;
    setLoading(true);
    setError(null);
    try {
      const result = await createBooking({
        userId,
        planId,
        date,
        time,
        notes: notes || undefined,
      });
      if (!result.success) {
        setError(result.error ?? "Failed to create booking");
        return;
      }
      const booking = result.data;
      if (!booking) {
        setError("Failed to create booking");
        return;
      }
      const amount = Number(selectedPlan.price);
      if (amount > 0) {
        const { iframeUrl } = await initiatePayment({
          userId,
          amountCents: Math.round(amount * 100),
          bookingId: booking.id,
          billingData,
        });
        window.location.href = iframeUrl;
        return;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No plans available for booking.</p>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">{t("success")}</h2>
          <p className="text-muted-foreground">We will confirm your session shortly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>

        {step === 1 && (
          <>
            <div>
              <Label className="text-base">{t("selectPlan")}</Label>
              <RadioGroup
                value={planId ?? ""}
                onValueChange={setPlanId}
                className="grid gap-3 mt-3"
              >
                {plans.map((plan) => (
                  <div key={plan.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                      {getLocalizedPlanField(plan, "title", locale)} — {Number(plan.price)} EGP
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button onClick={() => setStep(2)} disabled={!planId}>
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <Label className="text-base">{t("selectDate")}</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md border mt-3"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!date}>
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <Label className="text-base">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="mt-3">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!time || loading}
              >
                {loading ? "Booking..." : t("confirm")}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
