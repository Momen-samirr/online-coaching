import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { getAdminContext } from "@/lib/auth-admin";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const adminContext = await getAdminContext();
  if (!adminContext) redirect(`/${locale}/dashboard`);

  return (
    <AdminLayoutClient locale={locale}>
      {children}
    </AdminLayoutClient>
  );
}
