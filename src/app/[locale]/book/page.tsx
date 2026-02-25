import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActivePlans } from "@/lib/actions/plans";
import { getOrCreateCurrentUser } from "@/lib/actions/user.action";
import BookingFlow from "@/components/landing/BookingFlow";
import Header from "@/components/landing/Header";
import { Link } from "@/i18n/navigation";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string }>;
}) {
  const { locale } = await params;
  const { plan: planId } = await searchParams;
  const user = await currentUser();
  if (!user) redirect(`/${locale}?redirect_url=/${locale}/book`);

  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) redirect(`/${locale}`);

  const plans = await getActivePlans();
  const preselectedPlanId = planId && plans.some((p) => p.id === planId) ? planId : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 max-w-2xl mx-auto px-6">
        <p className="text-center text-muted-foreground text-sm mb-6">
          Book a single session. Want a subscription?{" "}
          <Link href="/plans" className="text-primary hover:underline font-medium">
            View Plans
          </Link>
        </p>
        <BookingFlow
          plans={plans}
          preselectedPlanId={preselectedPlanId}
          userId={dbUser.id}
          billingData={{
            firstName: dbUser.firstName ?? "Client",
            lastName: dbUser.lastName ?? "User",
            email: dbUser.email,
            phone: dbUser.phone ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
