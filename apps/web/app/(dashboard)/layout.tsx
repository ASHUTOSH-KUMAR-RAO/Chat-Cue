import { DashboardLayout } from "@/modules/dashboard/ui/layout/dashboard-layout";
import React from "react";

const Layou = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layou;
