import React from "react";
import { PageHeader, Panel } from "../components/ui/Display";
import PasswordForm from "../components/account/PasswordForm";
import LogoutPanel from "../components/account/LogoutPanel";

const AdminSettings = () => (
  <>
    <PageHeader title="Account settings" description="Keep your admin account secure." />
    <div className="max-w-3xl space-y-6">
      <Panel
        title="Password"
        description="Admins can change orders, menus and customer accounts, so use a password you don't use anywhere else."
      >
        <PasswordForm />
      </Panel>
      <LogoutPanel />
    </div>
  </>
);

export default AdminSettings;
