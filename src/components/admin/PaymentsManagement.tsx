"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CreditCard } from "lucide-react";
import EmptyState from "./EmptyState";

type Payment = Awaited<ReturnType<typeof import("@/lib/actions/payments").getPayments>>[number];

function toCSV(payments: Payment[]) {
  const headers = ["Date", "Amount", "Currency", "Status", "User", "Booking"];
  const rows = payments.map((p) => [
    new Date(p.createdAt).toISOString(),
    Number(p.amount),
    p.currency,
    p.status,
    p.user?.email ?? "",
    p.bookingId ?? "",
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function dateInputValue(d: string | undefined): string {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export default function PaymentsManagement({
  payments,
  initialFrom,
  initialTo,
}: {
  payments: Payment[];
  initialFrom?: string;
  initialTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");
  useEffect(() => {
    setFrom(initialFrom ?? "");
    setTo(initialTo ?? "");
  }, [initialFrom, initialTo]);

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleExport = () => {
    const csv = toCSV(payments);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fromLabel = from ? `-from-${from}` : "";
    const toLabel = to ? `-to-${to}` : "";
    a.href = url;
    a.download = `payments${fromLabel}${toLabel}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Payments
          </CardTitle>
          <CardDescription>Paymob transactions. Filter by date range and export to CSV.</CardDescription>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs">From</Label>
            <Input
              type="date"
              value={dateInputValue(from)}
              onChange={(e) => setFrom(e.target.value || "")}
              className="w-[140px]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To</Label>
            <Input
              type="date"
              value={dateInputValue(to)}
              onChange={(e) => setTo(e.target.value || "")}
              className="w-[140px]"
            />
          </div>
          <Button variant="outline" size="sm" onClick={applyFilter}>
            Apply
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{Number(payment.amount)} {payment.currency}</p>
                <p className="text-sm text-muted-foreground">
                  {payment.user?.email} — {new Date(payment.createdAt).toLocaleString()}
                </p>
                <Badge variant={payment.status === "SUCCESS" ? "default" : payment.status === "FAILED" ? "destructive" : "secondary"} className="mt-2">
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        {payments.length === 0 && (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Payments will appear here when transactions are completed."
          />
        )}
      </CardContent>
    </Card>
  );
}
