import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useUiStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";

const navItems = [
  {
    to: "/",
    label: "Today",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m-8-8H3m18 0h1M5.636 5.636l.707.707m11.314 11.314.707.707M5.636 18.364l.707-.707m11.314-11.314.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
        />
      </svg>
    ),
  },
  {
    to: "/week",
    label: "Week",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    to: "/month",
    label: "Month",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    to: "/habits",
    label: "Habits",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
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
          {theme === "dark" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m-8-8H3m18 0h1M5.636 5.636l.707.707m11.314 11.314.707.707M5.636 18.364l.707-.707m11.314-11.314.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
          <span className="text-sm font-medium hidden lg:block">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-medium hidden lg:block">Sign out</span>
        </button>
      </div>
    </nav>
  );
}
