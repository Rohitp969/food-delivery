import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Receipt,
  Settings,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useCart } from "../context/ContextReducer";
import { useWishlist } from "../context/WishlistContext";
import { Avatar } from "./ui/Display";
import { clearSession, getSession } from "../lib/session";
import { buttonStyles, cx } from "../lib/styles";

const ACCOUNT_LINKS = [
  { to: "/profile", label: "Your account", icon: UserRound },
  { to: "/myorder", label: "My orders", icon: Receipt },
  { to: "/wishlist", label: "Saved dishes", icon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: LifeBuoy },
];

const navLinkClass = ({ isActive }) =>
  cx(
    "rounded-lg px-3 py-2 text-[15px] font-medium no-underline transition-colors",
    isActive ? "text-white" : "text-slate-300 hover:text-white",
  );

// Closes a popover on outside click or Escape
const useDismiss = (open, setOpen) => {
  const ref = useRef(null);
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
  }, [open, setOpen]);
  return ref;
};

const Navbar = () => {
  const navigate = useNavigate();
  const cart = useCart();
  const { wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useDismiss(menuOpen, setMenuOpen);

  const { token, name, email, role } = getSession();
  const isLoggedIn = Boolean(token);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const logout = () => {
    clearSession();
    setMenuOpen(false);
    setMobileOpen(false);
    toast.success("You're logged out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-ink">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl leading-none" aria-hidden="true">
            🍔
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-saffron">GoFood</span>
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Restaurants
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/myorder" className={navLinkClass}>
              My orders
            </NavLink>
          )}
          <NavLink to="/help" className={navLinkClass}>
            Help
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {wishlistCount > 0 && (
            <Link
              to="/wishlist"
              aria-label={`Saved dishes (${wishlistCount})`}
              title="Saved dishes"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white sm:flex"
            >
              <Heart className="h-5 w-5" />
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex h-10 items-center gap-2 rounded-lg px-3 text-[15px] font-semibold text-white no-underline hover:bg-white/10"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="tabular rounded-full bg-saffron px-1.5 text-xs font-bold leading-5 text-ink">
                {cartCount}
                <span className="sr-only"> items</span>
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-white hover:bg-white/10"
              >
                <Avatar name={name} size="sm" className="bg-saffron! text-ink!" />
                <span className="max-w-[120px] truncate text-sm font-semibold">{name?.split(" ")[0]}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-lg animate-rise-in"
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate font-semibold text-ink">{name}</p>
                    <p className="truncate text-sm text-muted">{email}</p>
                  </div>
                  <div className="py-1.5">
                    {role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-2 text-[15px] font-semibold text-ink no-underline hover:bg-canvas"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted" aria-hidden="true" /> Admin panel
                      </Link>
                    )}
                    {ACCOUNT_LINKS.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-[15px] text-ink no-underline hover:bg-canvas"
                      >
                        <Icon className="h-4 w-4 text-muted" aria-hidden="true" /> {label}
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
                      <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="rounded-lg px-3 py-2 text-[15px] font-semibold text-white no-underline hover:bg-white/10">
                Log in
              </Link>
              <Link to="/signup" className={cx(buttonStyles("primary"), "bg-saffron! text-ink! hover:bg-yellow-300! no-underline")}>
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav aria-label="Mobile" className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden animate-rise-in">
          {isLoggedIn && (
            <div className="mb-2 flex items-center gap-3 border-b border-white/10 px-1 py-3">
              <Avatar name={name} size="md" className="bg-saffron! text-ink!" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{name}</p>
                <p className="truncate text-sm text-slate-400">{email}</p>
              </div>
            </div>
          )}
          {[
            { to: "/", label: "Restaurants" },
            ...(isLoggedIn ? ACCOUNT_LINKS : [{ to: "/help", label: "Help" }]),
            ...(role === "admin" ? [{ to: "/admin/dashboard", label: "Admin panel" }] : []),
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-200 no-underline hover:bg-white/10"
            >
              {label}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={logout}
              className="mt-2 block w-full rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-red-300 hover:bg-white/10"
            >
              Log out
            </button>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/login" className={cx(buttonStyles("secondary"), "no-underline")}>
                Log in
              </Link>
              <Link to="/signup" className={cx(buttonStyles("primary"), "bg-saffron! text-ink! no-underline")}>
                Sign up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
