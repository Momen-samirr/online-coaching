import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Calendar,
  CheckCircle,
  CreditCard,
  FileText,
  LayoutList,
  MessageSquare,
  Package,
  Users,
} from "lucide-react";

interface AdminStatusProps {
  totalPlans: number;
  activePlans: number;
  totalBookings: number;
  confirmedBookings: number;
  totalUsers?: number;
  totalPayments?: number;
  revenue?: number;
  blogCount?: number;
  testimonialsCount?: number;
}

const AdminStatus = ({
  totalPlans,
  activePlans,
  totalBookings,
  confirmedBookings,
  totalUsers = 0,
  totalPayments = 0,
  revenue = 0,
  blogCount = 0,
  testimonialsCount = 0,
}: AdminStatusProps) => {
  return (
    <div className="space-y-6 mb-13">
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 bg-linear-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Package className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalPlans}</div>
                <div className="text-muted-foreground text-sm">Total Plans</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <LayoutList className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{activePlans}</div>
                <div className="text-muted-foreground text-sm">Active Plans</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Calendar className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalBookings}</div>
                <div className="text-muted-foreground text-sm">Total Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <CheckCircle className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{confirmedBookings}</div>
                <div className="text-muted-foreground text-sm">Confirmed Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-5 gap-6">
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Users className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalUsers}</div>
                <div className="text-muted-foreground text-sm">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <CreditCard className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalPayments}</div>
                <div className="text-muted-foreground text-sm">Payments (success)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <CreditCard className="size-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{revenue.toFixed(0)}</div>
                <div className="text-muted-foreground text-sm">Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <FileText className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{blogCount}</div>
                <div className="text-muted-foreground text-sm">Blog Posts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border transition-colors duration-200 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <MessageSquare className="size-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{testimonialsCount}</div>
                <div className="text-muted-foreground text-sm">Testimonials</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatus;
