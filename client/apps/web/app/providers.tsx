"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ApiClient } from "@repo/shared";

const ApiContext = createContext<ApiClient | null>(null);

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi must be used within an ApiProvider");
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  const apiClient = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
    return new ApiClient(baseUrl);
  }, []);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ApiContext.Provider value={apiClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ApiContext.Provider>
    </GoogleOAuthProvider>
  );
}
