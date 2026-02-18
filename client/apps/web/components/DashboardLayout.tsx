"use client";

import { Sidebar } from "./Sidebar";
import styles from "./DashboardLayout.module.css";
import { useAuth } from "../hooks/useAuth";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // If not authenticated, the pages themselves should handle redirection or show login
  // but for the layout of authenticated pages, we assume we want the sidebar
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
