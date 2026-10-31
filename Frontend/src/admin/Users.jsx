import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { BadgeCheck, Pencil, RotateCw, Search, Trash2, Users as UsersIcon } from "lucide-react";
import Button from "../components/ui/Button";
import { ConfirmDialog, Modal } from "../components/ui/Modal";
import { Avatar, Badge, EmptyState, PageHeader, Panel, TableSkeleton } from "../components/ui/Display";
import { Input, Select } from "../components/ui/Field";
import FormAlert from "../components/FormAlert";
import { api } from "../lib/api";
import { formatCurrency, formatDate, formatNumber } from "../lib/format";
import { getSession } from "../lib/session";
import { useFetch } from "../lib/useFetch";
import { cx, inputStyles } from "../lib/styles";

const ROLE_TABS = [
  { value: "all", label: "Everyone" },
  { value: "user", label: "Customers" },
  { value: "admin", label: "Admins" },
];

const VerifiedBadge = ({ user }) =>
  user.isVerified ? (
    <Badge tone="leaf">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
    </Badge>
  ) : (
    <Badge tone="warn">Email not verified</Badge>
  );

const EditUserModal = ({ user, isSelf, onClose, onSaved }) => {
  const [form, setForm] = useState(() => ({
    name: user.name,
    phone: user.phone || "",
    location: user.location || "",
    role: user.role,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api(`/api/admin/users/${user.id}`, { method: "PUT", body: form });
      toast.success(`Saved ${data.user.name}`);
      onSaved(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      busy={saving}
      title={`Edit ${user.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="edit-user" loading={saving}>
            Save changes
          </Button>
        </>
      }
    >
      <form id="edit-user" onSubmit={save} className="space-y-4">
        <Input id="edit-email" label="Email" value={user.email} disabled hint="Orders are linked to this email, so it can't be changed." />
        <Input id="edit-name" label="Full name" name="name" value={form.name} onChange={onChange} required />
        <Input id="edit-phone" label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} optional />
        <Input id="edit-location" label="Delivery address" name="location" value={form.location} onChange={onChange} required />
        <Select
          id="edit-role"
          label="Role"
          name="role"
          value={form.role}
          onChange={onChange}
          disabled={isSelf}
          hint={isSelf ? "You can't change your own role." : "Admins can open this panel and manage everything in it."}
        >
          <option value="user">Customer</option>
          <option value="admin">Admin</option>
        </Select>
        <FormAlert>{error}</FormAlert>
      </form>
    </Modal>
  );
};

const Users = () => {
  const { data, error, loading, reload: fetchUsers, setData } = useFetch(() => api("/api/admin/users"), []);
  const users = useMemo(() => data?.users || [], [data]);
  const setUsers = (update) => setData((prev) => ({ ...prev, users: update(prev.users) }));
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const myEmail = getSession().email;

  const searched = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter(
      (u) => !term || [u.name, u.email, u.phone].some((v) => v?.toLowerCase().includes(term)),
    );
  }, [users, search]);
  const filtered = role === "all" ? searched : searched.filter((u) => u.role === role);
  const countFor = (value) => (value === "all" ? searched.length : searched.filter((u) => u.role === value).length);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      const data = await api(`/api/admin/users/${deleting.id}`, { method: "DELETE" });
      toast.success(data.message);
      setUsers((list) => list.filter((u) => u.id !== deleting.id));
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const rowActions = (user) => {
    const isSelf = user.email === myEmail;
    return (
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          icon={Pencil}
          onClick={() => setEditing(user)}
          aria-label={`Edit ${user.name}`}
          title="Edit"
        />
        <Button
          variant="danger-ghost"
          size="icon"
          icon={Trash2}
          onClick={() => setDeleting(user)}
          disabled={isSelf}
          aria-label={`Delete ${user.name}`}
          title={isSelf ? "You can't delete your own account" : "Delete"}
        />
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Customers"
        description="Everyone with a GoFood account, what they've ordered and whether they've verified their email."
      />

      <Panel bodyClassName="">
        <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Filter by role" className="flex gap-1">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={role === tab.value}
                onClick={() => setRole(tab.value)}
                className={cx(
                  "flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors",
                  role === tab.value ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink",
                )}
              >
                {tab.label}
                <span className={cx("tabular rounded-full px-1.5 text-xs", role === tab.value ? "bg-white/15" : "bg-canvas")}>
                  {countFor(tab.value)}
                </span>
              </button>
            ))}
          </div>
          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="user-search" className="sr-only">
              Search people
            </label>
            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email or phone"
              className={cx(inputStyles(false), "h-10 pl-9")}
            />
          </div>
        </div>

        {!data && loading ? (
          <TableSkeleton rows={6} />
        ) : !data && error ? (
          <EmptyState
            icon={UsersIcon}
            title="Couldn't load customers"
            description={error}
            action={<Button variant="secondary" icon={RotateCw} onClick={fetchUsers}>Try again</Button>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title={search ? "Nobody matches that search" : "No one here yet"}
            description={search ? "Check the spelling, or search by email instead." : "People appear here once they sign up."}
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold text-muted">
                    <th scope="col" className="px-5 py-3">Name</th>
                    <th scope="col" className="px-3 py-3">Phone</th>
                    <th scope="col" className="px-3 py-3 text-right">Orders</th>
                    <th scope="col" className="px-3 py-3 text-right">Spent</th>
                    <th scope="col" className="hidden px-3 py-3 xl:table-cell">Joined</th>
                    <th scope="col" className="px-3 py-3">Account</th>
                    <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-canvas/60">
                      <td className="max-w-[300px] px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} src={user.avatar} size="sm" />
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 truncate font-medium text-ink">
                              <span className="truncate">{user.name}</span>
                              {user.email === myEmail && <Badge>You</Badge>}
                            </p>
                            <p className="truncate text-sm text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="tabular whitespace-nowrap px-3 py-3 text-sm text-ink">{user.phone || <span className="text-muted">—</span>}</td>
                      <td className="tabular px-3 py-3 text-right text-ink">{formatNumber(user.orderCount)}</td>
                      <td className="tabular px-3 py-3 text-right text-ink">{formatCurrency(user.totalSpent)}</td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-sm text-muted xl:table-cell">{formatDate(user.joinedAt)}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {user.role === "admin" && <Badge tone="ink">Admin</Badge>}
                          <VerifiedBadge user={user} />
                        </div>
                      </td>
                      <td className="px-5 py-3">{rowActions(user)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line md:hidden">
              {filtered.map((user) => (
                <li key={user.id} className="flex gap-3 p-4">
                  <Avatar name={user.name} src={user.avatar} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">
                      {user.name} {user.email === myEmail && <Badge className="ml-1">You</Badge>}
                    </p>
                    <p className="truncate text-sm text-muted">{user.email}</p>
                    <p className="tabular mt-1 text-sm text-ink">
                      {user.orderCount} order{user.orderCount === 1 ? "" : "s"}, {formatCurrency(user.totalSpent)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {user.role === "admin" && <Badge tone="ink">Admin</Badge>}
                      <VerifiedBadge user={user} />
                    </div>
                  </div>
                  {rowActions(user)}
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      {editing && (
        <EditUserModal
          key={editing.id}
          user={editing}
          isSelf={editing.email === myEmail}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setUsers((list) => list.map((u) => (u.id === saved.id ? { ...u, ...saved } : u)));
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        busy={busy}
        title={`Delete ${deleting?.name}'s account?`}
        confirmLabel="Delete account"
      >
        {deleting && (
          <>
            <span className="font-semibold text-ink">{deleting.email}</span> won't be able to log in any more. Their{" "}
            {deleting.orderCount} past order{deleting.orderCount === 1 ? "" : "s"} stay in your records. This can't be undone.
          </>
        )}
      </ConfirmDialog>
    </>
  );
};

export default Users;
