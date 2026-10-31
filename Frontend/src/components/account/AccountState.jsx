import React from "react";
import { RotateCw, UserRound } from "lucide-react";
import Button from "../ui/Button";
import { EmptyState, Panel, Skeleton } from "../ui/Display";

// Loading and error states shared by the account pages
const AccountState = ({ loading, error, onRetry }) =>
  loading ? (
    <div className="space-y-4" role="status" aria-label="Loading your account">
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  ) : (
    <Panel>
      <EmptyState
        icon={UserRound}
        title="Couldn't load your account"
        description={error}
        action={
          <Button variant="secondary" icon={RotateCw} onClick={onRetry}>
            Try again
          </Button>
        }
      />
    </Panel>
  );

export default AccountState;
