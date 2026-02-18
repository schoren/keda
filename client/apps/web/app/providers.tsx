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

interface ProvidersConfig {
  apiUrl: string;
  googleClientId: string;
}

export function Providers({
  children,
  config
}: {
  children: React.ReactNode;
  config: ProvidersConfig;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  const apiClient = useMemo(() => {
    return new ApiClient(config.apiUrl);
  }, [config.apiUrl]);

  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <ApiContext.Provider value={apiClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ApiContext.Provider>
    </GoogleOAuthProvider>
  );
}
