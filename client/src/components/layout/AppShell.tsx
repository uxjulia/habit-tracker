import { Outlet } from "react-router-dom";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Desktop side nav */}
      <SideNav />

      {/* Main content */}
      <main className="md:ml-16 lg:ml-52 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
