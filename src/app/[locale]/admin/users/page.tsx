import { getUsers } from "@/lib/actions/users";
import UsersManagement from "@/components/admin/UsersManagement";

export default async function AdminUsersPage() {
  const users = await getUsers();
  return <UsersManagement users={users} />;
}
