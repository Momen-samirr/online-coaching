import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/actions/user.action";
import { getMyBookings } from "@/lib/actions/bookings";
import { getMySubscriptions } from "@/lib/actions/subscriptions";
import Header from "@/components/landing/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await currentUser();
  if (!user) redirect(`/${locale}?redirect_url=/${locale}/dashboard`);

  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) redirect(`/${locale}`);

  const [bookings, subscriptions] = await Promise.all([
    getMyBookings(dbUser.id),
    getMySubscriptions(dbUser.id),
  ]);
  const upcoming = bookings.filter(
    (b) => new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0)) && b.status !== "CANCELLED"
  );
  const past = bookings.filter(
    (b) => new Date(b.date) < new Date(new Date().setHours(0, 0, 0, 0)) || b.status === "CANCELLED"
  );

  const displayName =
    [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") ||
    (user.emailAddresses[0]?.emailAddress ?? "User");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 max-w-3xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground">{dbUser.email}</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                My sessions
              </CardTitle>
              <CardDescription>Upcoming and past sessions</CardDescription>
            </div>
            <Link
              href="/book"
              className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Book a session
            </Link>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                You have no sessions yet.{" "}
                <Link href="/book" className="text-primary hover:underline">
                  Book a session
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {upcoming.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming</h3>
                    <ul className="space-y-3">
                      {upcoming.map((b) => (
                        <li
                          key={b.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium">{b.plan.titleEn}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(b.date).toLocaleDateString()} at {b.time}
                              {b.plan.duration ? ` · ${b.plan.duration}` : ""}
                            </p>
                          </div>
                          <Badge
                            variant={
                              b.status === "CONFIRMED"
                                ? "default"
                                : b.status === "CANCELLED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {b.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {past.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Past</h3>
                    <ul className="space-y-3">
                      {past.slice(0, 5).map((b) => (
                        <li
                          key={b.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 opacity-80"
                        >
                          <div>
                            <p className="font-medium">{b.plan.titleEn}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(b.date).toLocaleDateString()} at {b.time}
                            </p>
                          </div>
                          <Badge variant="outline">{b.status}</Badge>
                        </li>
                      ))}
                    </ul>
                    {past.length > 5 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        and {past.length - 5} more past session(s)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2" id="my-plans-heading">
                <Package className="size-5" aria-hidden />
                My plans
              </CardTitle>
              <CardDescription id="my-plans-desc">Your active subscriptions</CardDescription>
            </div>
            <Link
              href="/plans"
              className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-describedby="my-plans-desc"
            >
              View plans
            </Link>
          </CardHeader>
          <CardContent aria-labelledby="my-plans-heading" aria-describedby="my-plans-desc">
            {subscriptions.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                You have no plans yet.{" "}
                <Link href="/plans" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                  Browse plans
                </Link>
              </p>
            ) : (
              <ul className="space-y-3" aria-label="Active plans">
                {subscriptions.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 transition-colors duration-150"
                  >
                    <div>
                      <p className="font-medium">{sub.plan.titleEn}</p>
                      <p className="text-sm text-muted-foreground">
                        {sub.startDate.toLocaleDateString()}
                        {sub.endDate ? ` – ${sub.endDate.toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <Badge
                      variant={
                        sub.status === "ACTIVE"
                          ? "default"
                          : sub.status === "EXPIRED" || sub.status === "CANCELLED"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
