import { AuthGaurd } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGaurd } from "@/modules/auth/ui/components/organization-gaurd";
import React from "react";

const Layou = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGaurd>
      <OrganizationGaurd>{children}</OrganizationGaurd>
    </AuthGaurd>
  );
};

export default Layou;
