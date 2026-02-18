"use client";

import { useState, useCallback, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useApi } from "../app/providers";
import { User, AuthResponse } from "@repo/shared";

export function useAuth() {
  const api = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("keda_token");
    const storedUser = localStorage.getItem("keda_user");
    const storedHouseholdId = localStorage.getItem("keda_household_id");

    if (storedToken && storedUser && storedHouseholdId) {
      api.setToken(storedToken);
      api.setHouseholdId(storedHouseholdId);
      setUser(JSON.parse(storedUser));
      setHouseholdId(storedHouseholdId);
    }
    setIsLoading(false);
  }, [api]);

  const handleAuthSuccess = useCallback((auth: AuthResponse) => {
    api.setToken(auth.token);
    api.setHouseholdId(auth.household_id);

    setUser(auth.user);
    setHouseholdId(auth.household_id);

    // Persist
    localStorage.setItem("keda_token", auth.token);
    localStorage.setItem("keda_user", JSON.stringify(auth.user));
    localStorage.setItem("keda_household_id", auth.household_id);
  }, [api]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const auth = await api.loginWithGoogle(undefined, tokenResponse.access_token);
        handleAuthSuccess(auth);
      } catch (error) {
        console.error("Login failed:", error);
        alert("Error al iniciar sesión. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      console.error("Google Login Failed");
    },
  });

  const logout = useCallback(() => {
    setUser(null);
    setHouseholdId(null);
    localStorage.removeItem("keda_token");
    localStorage.removeItem("keda_user");
    localStorage.removeItem("keda_household_id");
  }, []);

  return {
    user,
    householdId,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
