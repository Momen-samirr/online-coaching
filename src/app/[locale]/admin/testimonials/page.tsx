import { getTestimonials } from "@/lib/actions/testimonials";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsManagement testimonials={testimonials} />;
}
