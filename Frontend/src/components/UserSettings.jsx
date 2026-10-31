import React from "react";
import AccountShell from "./account/AccountShell";
import LogoutPanel from "./account/LogoutPanel";
import PasswordForm from "./account/PasswordForm";
import { Panel } from "./ui/Display";

const UserSettings = () => (
  <AccountShell title="Your account" description="Your details, delivery address and order history in one place.">
    <div className="space-y-6">
      <Panel title="Password" description="We'll email you whenever your password changes.">
        <PasswordForm />
      </Panel>
      <LogoutPanel />
    </div>
  </AccountShell>
);

export default UserSettings;
