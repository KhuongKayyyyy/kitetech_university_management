import React from "react";

import AccountSection from "@/components/ui/custom/user/account/AccountSection";
import RoleSection from "@/components/ui/custom/user/account/RoleSection";

export default function page() {
  return (
    <div>
      <RoleSection />
      <AccountSection />
    </div>
  );
}
