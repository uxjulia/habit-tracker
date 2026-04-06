import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { SetupPage } from "./pages/SetupPage";
import { TodayPage } from "./pages/TodayPage";
import { WeekPage } from "./pages/WeekPage";
import { MonthPage } from "./pages/MonthPage";
import { HabitsPage } from "./pages/HabitsPage";
import { useAuthStore } from "./store/authStore";
import { useUiStore } from "./store/uiStore";
import { getStatus } from "./api/auth";
import { queryKeys } from "./api/queryKeys";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  // Only check setup status when the user isn't logged in
  const { data: status, isLoading } = useQuery({
    queryKey: queryKeys.auth.status,
    queryFn: getStatus,
    enabled: !token,
    retry: false,
    staleTime: Infinity,
  });

  if (token) return <>{children}</>;

  // Wait for the status check before deciding where to send the user
  if (isLoading) return null;

  if (status?.setupRequired) return <Navigate to="/setup" replace />;

  return <Navigate to="/login" state={{ from: location }} replace />;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route
              path="/"
              element={
                <AuthGate>
                  <AppShell />
                </AuthGate>
              }
            >
              <Route index element={<TodayPage />} />
              <Route path="week" element={<WeekPage />} />
              <Route path="month" element={<MonthPage />} />
              <Route path="habits" element={<HabitsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
