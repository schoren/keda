import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Keda - Finanzas Familiares",
  description: "Gestión inteligente de gastos familiares",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = {
    apiUrl: process.env.KEDA_API_URL || "http://localhost:8090",
    googleClientId: process.env.KEDA_GOOGLE_CLIENT_ID || "",
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers config={config}>
          {children}

        </Providers>
      </body>
    </html>
  );
}
