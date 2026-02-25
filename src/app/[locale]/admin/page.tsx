import AdminDashboardClient from "@/app/admin/AdminDashboardClient";
import { getUsers } from "@/lib/actions/users";
import { getPayments } from "@/lib/actions/payments";
import { getBlogPosts } from "@/lib/actions/blog";
import { getTestimonials } from "@/lib/actions/testimonials";
import { getPlans } from "@/lib/actions/plans";
import { getBookings } from "@/lib/actions/bookings";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [users, payments, blogPosts, testimonials, plans, bookings] = await Promise.all([
    getUsers(),
    getPayments(),
    getBlogPosts(true),
    getTestimonials(),
    getPlans(),
    getBookings(),
  ]);
  const totalUsers = users.length;
  const successPayments = payments.filter((p) => p.status === "SUCCESS");
  const totalPayments = successPayments.length;
  const revenue = successPayments.reduce((s, p) => s + Number(p.amount), 0);
  const blogCount = blogPosts.length;
  const testimonialsCount = testimonials.length;
  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => p.isActive).length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <AdminDashboardClient
      locale={locale}
      stats={{
        totalUsers,
        totalPayments,
        revenue,
        blogCount,
        testimonialsCount,
        totalPlans,
        activePlans,
        totalBookings,
        confirmedBookings,
      }}
    />
  );
}
