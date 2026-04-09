import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useUiStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { Sun, CalendarMinus2, CalendarDays, CircleCheck, Moon, LogOut } from "lucide-react";

const navItems = [
  {
    to: "/",
    label: "Today",
    icon: <Sun size={20} />,
  },
  {
    to: "/week",
    label: "Week",
    icon: <CalendarMinus2 size={20} />,
  },
  {
    to: "/month",
    label: "Month",
    icon: <CalendarDays size={20} />,
  },
  {
    to: "/habits",
    label: "Habits",
    icon: <CircleCheck size={20} />,
  },
];

export function SideNav() {
  const { theme, toggleTheme } = useUiStore();
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 lg:w-52 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-30">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-4 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-lg font-semibold tracking-tight hidden lg:block">Habits</span>
        <span className="text-lg font-semibold lg:hidden">H</span>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col gap-1 p-2 lg:p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              )
            }
          >
            {item.icon}
            <span className="text-sm font-medium hidden lg:block">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="p-2 lg:p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}

          <span className="text-sm font-medium hidden lg:block">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium hidden lg:block">Sign out</span>
        </button>
      </div>
    </nav>
  );
}
