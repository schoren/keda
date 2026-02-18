"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import styles from "./Sidebar.module.css";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Cuentas", href: "/accounts", icon: Wallet },
  { name: "Transacciones", href: "/transactions", icon: Receipt },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>K</div>
          <span className={styles.logoText}>Keda</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className={styles.userCard}>
          {user?.picture_url && (
            <Image
              src={user.picture_url}
              alt={user.name}
              width={32}
              height={32}
              className={styles.avatar}
            />
          )}
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>

        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
