import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem("auth_token");
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!token) return null;
      
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        localStorage.removeItem("auth_token");
        return null;
      }
      
      return response.json();
    },
    retry: false,
    enabled: !!token,
    staleTime: 0,
  });

  const isAuthenticated = !!user && !!token && !error;

  const logout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  return {
    user,
    isLoading: token ? isLoading : false,
    isAuthenticated,
    logout,
  };
}