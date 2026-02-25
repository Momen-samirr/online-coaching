import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await currentUser();
  if (!user) redirect(`/${locale}`);

  const adminEmail = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0]?.emailAddress !== adminEmail) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <AdminLayoutClient locale={locale}>
      {children}
    </AdminLayoutClient>
  );
}
