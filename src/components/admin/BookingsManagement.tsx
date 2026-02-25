"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { updateBookingStatus, rescheduleBooking } from "@/lib/actions/bookings";
import { Calendar } from "../ui/calendar";
import EmptyState from "./EmptyState";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

type Booking = Awaited<ReturnType<typeof import("@/lib/actions/bookings").getBookings>>[number];

export default function BookingsManagement({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [rescheduleBookingRow, setRescheduleBookingRow] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const openReschedule = (booking: Booking) => {
    setRescheduleBookingRow(booking);
    setRescheduleDate(new Date(booking.date));
    setRescheduleTime(booking.time);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleBookingRow || !rescheduleDate || !rescheduleTime) return;
    setSaving(true);
    try {
      const result = await rescheduleBooking(rescheduleBookingRow.id, rescheduleDate, rescheduleTime);
      if (result.success) {
        toast.success("Booking rescheduled");
        router.refresh();
        setRescheduleBookingRow(null);
      } else {
        toast.error(result.error ?? "Failed to reschedule");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5" />
            Sessions
          </CardTitle>
          <CardDescription>View and update session status. Reschedule when needed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {booking.user.firstName} {booking.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{booking.user.email}</p>
                  <p className="text-sm mt-1">
                    {booking.plan.titleEn} — {new Date(booking.date).toLocaleDateString()} {booking.time}
                  </p>
                  <Badge variant={booking.status === "CONFIRMED" ? "default" : booking.status === "CANCELLED" ? "destructive" : "secondary"} className="mt-2">
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReschedule(booking)}
                  >
                    Reschedule
                  </Button>
                  <Select
                    value={booking.status}
                    onValueChange={async (v) => {
                      const result = await updateBookingStatus(booking.id, v as "PENDING" | "CONFIRMED" | "CANCELLED");
                      if (result.success) {
                        toast.success("Booking status updated");
                        router.refresh();
                      } else {
                        toast.error(result.error ?? "Failed to update status");
                      }
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
          {bookings.length === 0 && (
            <EmptyState
              icon={CalendarIcon}
              title="No sessions yet"
              description="Sessions will appear here when clients book."
            />
          )}
        </CardContent>
      </Card>
      <Dialog open={!!rescheduleBookingRow} onOpenChange={(o) => !o && setRescheduleBookingRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={rescheduleDate}
                onSelect={setRescheduleDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleBookingRow(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleRescheduleSubmit}
              disabled={saving || !rescheduleDate || !rescheduleTime}
            >
              {saving ? "Saving..." : "Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
