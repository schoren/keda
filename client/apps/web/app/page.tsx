"use client";

import { useAuth } from "../hooks/useAuth";
import { Summary } from "../components/Summary";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  const { user, householdId, login, logout, isAuthenticated, isLoading } = useAuth();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (isAuthenticated && householdId) {
    return (
      <main className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.userProfile}>
            {user?.picture_url && (
              <Image
                src={user.picture_url}
                alt={user.name}
                width={40}
                height={40}
                className={styles.avatar}
              />
            )}
            <div>
              <h3>Hola, {user?.name}!</h3>
              <p>Hogar: {householdId.slice(0, 8)}...</p>
            </div>
          </div>
          <button onClick={logout} className={styles.secondaryBtn}>Cerrar sesión</button>
        </header>

        <div className={styles.content}>
          <div className={styles.grid}>
            <Summary month={currentMonth} householdId={householdId} />

            <div className={styles.placeholderCard}>
              <h3>Cuentas</h3>
              <p>Próximamente: Lista de tus bancos y tarjetas.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.hero}>
      <div className={styles.glassCard}>
        <div className={styles.logoContainer}>
          <h1 className={styles.gradientText}>Keda</h1>
          <p className={styles.tagline}>Finanzas familiares simplificadas</p>
        </div>

        <div className={styles.authBox}>
          <p>Controla tus gastos con transparencia y facilidad.</p>
          <button onClick={() => login()} className={styles.googleBtn}>
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}
