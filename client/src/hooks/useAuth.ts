import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 0,
  });

  const isAuthenticated = !!user && !error;

  const logout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  };
}