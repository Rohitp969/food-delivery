import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Badge, PageHeader, Panel } from "../components/ui/Display";
import ProfileForm from "../components/account/ProfileForm";
import AccountState from "../components/account/AccountState";
import { formatDate } from "../lib/format";
import { useAccount } from "../lib/useAccount";

const AdminProfile = () => {
  const { user, setUser, error, loading, reload } = useAccount();

  return (
    <>
      <PageHeader
        title="My profile"
        description="Your name, photo and contact details. Other admins see these in the customer list."
      />

      {!user ? (
        <AccountState loading={loading} error={error} onRetry={reload} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          <Panel title="Profile details" className="lg:col-span-2">
            <ProfileForm user={user} onSaved={setUser} />
          </Panel>

          <Panel title="Account" bodyClassName="px-5 py-2">
            <dl className="divide-y divide-line text-[15px]">
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted">Role</dt>
                <dd><Badge tone="ink">Admin</Badge></dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted">Email</dt>
                <dd>
                  {user.isVerified ? (
                    <span className="flex items-center gap-1 font-medium text-leaf-dark">
                      <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified
                    </span>
                  ) : (
                    <Badge tone="warn">Not verified</Badge>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted">Joined</dt>
                <dd className="text-ink">{formatDate(user.joinedAt)}</dd>
              </div>
              <div className="py-3">
                <Link to="/admin/settings" className="text-sm font-semibold text-leaf no-underline hover:text-leaf-dark">
                  Change your password
                </Link>
              </div>
            </dl>
          </Panel>
        </div>
      )}
    </>
  );
};

export default AdminProfile;
