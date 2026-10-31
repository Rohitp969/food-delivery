import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LifeBuoy,
  Receipt,
  Store,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cx } from "../lib/styles";

const SECTIONS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Sales", path: "/admin/sales", icon: BarChart3 },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Orders", path: "/admin/orders", icon: Receipt, badge: "newOrders" },
      { name: "Menu", path: "/admin/food-list", icon: UtensilsCrossed, also: ["/admin/add-food"] },
      { name: "Customers", path: "/admin/users", icon: Users },
    ],
  },
];

const Brand = ({ collapsed }) => (
  <div className={cx("flex h-16 items-center gap-2.5 px-4", collapsed && "lg:justify-center lg:px-0")}>
    <span className="text-2xl leading-none" aria-hidden="true">
      🍔
    </span>
    <span className={cx("font-display text-lg font-bold tracking-tight text-saffron", collapsed && "lg:hidden")}>
      GoFood
      <span className="ml-1.5 font-sans text-xs font-medium text-slate-400">Admin</span>
    </span>
  </div>
);

const NavItem = ({ item, collapsed, count, onNavigate }) => {
  const Icon = item.icon;
  const { pathname } = useLocation();
  // "Add food" lives under Menu, so Menu stays highlighted there
  const alsoActive = item.also?.some((p) => pathname.startsWith(p));

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onNavigate}
      title={collapsed ? item.name : undefined}
      className={({ isActive }) =>
        cx(
          "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[15px] font-medium no-underline transition-colors",
          collapsed && "lg:justify-center lg:px-0",
          isActive || alsoActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white",
        )
      }
    >
      {({ isActive }) => (
        <>
          {(isActive || alsoActive) && (
            <span className="absolute inset-y-2 -left-3 w-[3px] rounded-r bg-saffron" aria-hidden="true" />
          )}
          <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          <span className={cx("flex-1", collapsed && "lg:sr-only")}>{item.name}</span>
          {count > 0 && (
            <span
              className={cx(
                "tabular rounded-full bg-saffron px-1.5 py-px text-xs font-bold text-ink",
                collapsed && "lg:absolute lg:right-2 lg:top-1 lg:px-1 lg:text-[10px]",
              )}
            >
              {count}
              <span className="sr-only"> new</span>
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

const AdminSidebar = ({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile, newOrders }) => {
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && onCloseMobile();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, onCloseMobile]);

  const counts = { newOrders };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden animate-fade-in" onClick={onCloseMobile} aria-hidden="true" />
      )}
      <aside
        aria-label="Admin navigation"
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink transition-[transform,width] duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed && "lg:w-[72px]",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10">
          <Brand collapsed={collapsed} />
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <p className={cx("mb-1.5 px-3 text-xs font-medium text-slate-500", collapsed && "lg:sr-only")}>
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    collapsed={collapsed}
                    count={counts[item.badge]}
                    onNavigate={onCloseMobile}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-white/10 px-3 py-3">
          <NavItem item={{ name: "View store", path: "/", icon: Store }} collapsed={collapsed} onNavigate={onCloseMobile} />
          <NavItem
            item={{ name: "Help", path: "/admin/help", icon: LifeBuoy }}
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
          <button
            type="button"
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : undefined}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cx(
              "hidden h-10 w-full items-center gap-3 rounded-lg px-3 text-[15px] font-medium text-slate-400 hover:bg-white/5 hover:text-white lg:flex",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
