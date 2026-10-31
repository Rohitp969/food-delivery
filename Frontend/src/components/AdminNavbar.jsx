import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LifeBuoy, LogOut, Menu, Search, Settings, Store, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { Avatar } from "./ui/Display";
import { clearSession, getSession } from "../lib/session";
import { cx } from "../lib/styles";

const MENU_ITEMS = [
  { label: "My profile", to: "/admin/profile", icon: UserRound },
  { label: "Account settings", to: "/admin/settings", icon: Settings },
  { label: "View store", to: "/", icon: Store },
  { label: "Help", to: "/admin/help", icon: LifeBuoy },
];

const AccountMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { name, email } = getSession();

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const logout = () => {
    clearSession();
    toast.success("You're logged out");
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-canvas"
      >
        <Avatar name={name} size="sm" />
        <span className="hidden max-w-[140px] truncate text-sm font-semibold text-ink md:block">{name}</span>
        <ChevronDown className="hidden h-4 w-4 text-muted md:block" aria-hidden="true" />
        <span className="sr-only">Open account menu</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-lg animate-rise-in"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate font-semibold text-ink">{name}</p>
            <p className="truncate text-sm text-muted">{email}</p>
          </div>
          <div className="py-1.5">
            {MENU_ITEMS.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-[15px] text-ink no-underline hover:bg-canvas"
              >
                <Icon className="h-4 w-4 text-muted" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-line py-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="flex w-full items-center gap-3 px-4 py-2 text-[15px] font-medium text-danger hover:bg-danger-soft"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminNavbar = ({ onOpenMenu, newOrders }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/admin/orders?q=${encodeURIComponent(q)}`);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-canvas lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form onSubmit={search} role="search" className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <label htmlFor="admin-search" className="sr-only">
          Search orders
        </label>
        <input
          id="admin-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders by email, name or order #"
          className="h-10 w-full rounded-lg border border-transparent bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-leaf focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf/25"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        {newOrders > 0 && (
          <Link
            to="/admin/orders?status=Preparing"
            className={cx(
              "flex items-center gap-2 rounded-full bg-saffron-soft px-3 py-1.5 text-sm font-semibold text-amber-900 no-underline ring-1 ring-inset ring-amber-200 hover:bg-saffron/40",
            )}
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span className="tabular">{newOrders}</span> new order{newOrders === 1 ? "" : "s"}
          </Link>
        )}
        <AccountMenu />
      </div>
    </header>
  );
};

export default AdminNavbar;
