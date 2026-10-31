import { api } from "./api";
import { useFetch } from "./useFetch";

// The logged-in user's profile and order stats from /api/account/me
export const useAccount = () => {
  const { data, error, loading, reload, setData } = useFetch(() => api("/api/account/me"), []);

  return {
    user: data?.user || null,
    stats: data?.stats || null,
    setUser: (user) => setData((prev) => ({ ...prev, user })),
    error,
    loading,
    reload,
  };
};
