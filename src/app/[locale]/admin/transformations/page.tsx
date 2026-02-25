import { getTransformations } from "@/lib/actions/transformations";
import TransformationsManagement from "@/components/admin/TransformationsManagement";

export default async function AdminTransformationsPage() {
  const transformations = await getTransformations();
  return <TransformationsManagement transformations={transformations} />;
}

