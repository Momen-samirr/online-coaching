"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/lib/actions/bookings";

export function useGetBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
}
