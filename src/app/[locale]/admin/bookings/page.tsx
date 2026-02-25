import { getBookings } from "@/lib/actions/bookings";
import BookingsManagement from "@/components/admin/BookingsManagement";

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  return <BookingsManagement bookings={bookings} />;
}
