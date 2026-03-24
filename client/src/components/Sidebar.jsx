import React, { useState } from "react";
import {
  CircleStar,
  Hexagon,
  ShoppingBag,
  Package,
  LayoutDashboard,
  ChevronsUp,
  Swords,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Habits", path: "/habits", icon: ChevronsUp },
  { name: "Quests", path: "/quests", icon: Swords },
  { name: "Gates", path: "/gates", icon: Hexagon },
  { name: "Awakening", path: "/awakening", icon: CircleStar },
  { name: "Shop", path: "/shop", icon: ShoppingBag },
  { name: "Inventory", path: "/inventory", icon: Package },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
const progression = useAuthStore((state) => state.progression);

const hunterName = user?.hunterName || "Shadow";
const initial = hunterName.charAt(0).toUpperCase();

const level = progression?.level || 1;
const rank = progression?.rank || "E-Rank Hunter";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0b0f17]/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
            <Swords className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white tracking-wide">SYSTEM</p>
            <p className="text-[11px] text-zinc-400">Hunter Dashboard</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-[#0b0f17] text-white transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Mobile Close */}
        <div className="flex items-center justify-between px-5 pt-5 md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 shadow-[0_0_25px_rgba(139,92,246,0.12)]">
              <Swords className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide text-violet-300">
                SYSTEM
              </h1>
              <p className="text-xs text-zinc-400">Solo Leveling Tracker</p>
            </div>
          </div>

          <button
            onClick={closeMobile}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden px-5 pt-6 md:block">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 shadow-[0_0_25px_rgba(139,92,246,0.12)]">
              <Swords className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-violet-300">
                SYSTEM
              </h1>
              <p className="text-xs text-zinc-400">Solo Leveling Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex-1 overflow-y-auto px-4 pb-4">
          

          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200 ${
                          isActive
                            ? "system-border border border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.10)]"
                            : "border border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition group-hover:bg-white/10">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Area */}
        <div className="border-t border-white/10 p-4">

          {/* Profile */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/15 text-sm font-bold text-violet-300">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {hunterName}
                </p>
                <p className="text-xs text-zinc-400">Lvl {level}</p>
                <p className="truncate text-xs text-violet-300">{rank}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/15"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;