import { getPayments } from "@/lib/actions/payments";
import PaymentsManagement from "@/components/admin/PaymentsManagement";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const from = params.from ? new Date(params.from) : undefined;
  const to = params.to ? new Date(params.to) : undefined;
  if (from && isNaN(from.getTime())) throw new Error("Invalid from date");
  if (to && isNaN(to.getTime())) throw new Error("Invalid to date");
  const payments = await getPayments({ from, to });
  return (
    <PaymentsManagement
      payments={payments}
      initialFrom={params.from}
      initialTo={params.to}
    />
  );
}
