import { z } from "zod";

export const bookingSchema = z.object({
  planId: z.string().min(1, "Plan is required"),
  date: z.coerce.date(),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const createBookingSchema = bookingSchema.extend({
  userId: z.string().min(1, "User is required"),
  duration: z.number().min(1).optional(),
});

export const rescheduleSchema = z.object({
  bookingId: z.string().min(1),
  date: z.coerce.date(),
  time: z.string().min(1, "Time is required"),
});

export type RescheduleInput = z.infer<typeof rescheduleSchema>;
