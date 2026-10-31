import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronRight } from "lucide-react";
import AccountShell from "./account/AccountShell";
import AccountState from "./account/AccountState";
import ProfileForm from "./account/ProfileForm";
import { Avatar, Panel } from "./ui/Display";
import { formatCurrency, formatDate, formatNumber, timeAgo } from "../lib/format";
import { useAccount } from "../lib/useAccount";

const Profile = () => {
  const { user, setUser, stats, error, loading, reload } = useAccount();

  return (
    <AccountShell title="Your account" description="Your details, delivery address and order history in one place.">
      {!user ? (
        <AccountState loading={loading} error={error} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <section className="flex items-center gap-4 rounded-xl border border-line bg-white p-5">
            <Avatar name={user.name} src={user.avatar} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-semibold text-ink">{user.name}</p>
              <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
                <span className="truncate">{user.email}</span>
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 font-medium text-leaf-dark">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-sm text-muted">Member since {formatDate(user.joinedAt)}</p>
            </div>
          </section>

          <Link
            to="/myorder"
            className="group grid gap-px overflow-hidden rounded-xl border border-line bg-line no-underline sm:grid-cols-3 [&>div]:bg-white"
          >
            <div className="px-5 py-4">
              <p className="text-sm text-muted">Orders placed</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{formatNumber(stats.totalOrders)}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted">Total spent</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{formatCurrency(stats.totalSpent)}</p>
            </div>
            <div className="flex items-center justify-between gap-2 px-5 py-4">
              <div>
                <p className="text-sm text-muted">On the way</p>
                <p className="mt-1 text-2xl font-semibold text-ink">{formatNumber(stats.activeOrders)}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
            <span className="sr-only">View my orders</span>
          </Link>
          {stats.lastOrderAt && (
            <p className="-mt-3 text-sm text-muted">Your last order was {timeAgo(stats.lastOrderAt)}.</p>
          )}

          <Panel title="Profile details" description="We use your phone and address for deliveries.">
            <ProfileForm user={user} onSaved={setUser} />
          </Panel>
        </div>
      )}
    </AccountShell>
  );
};

export default Profile;
