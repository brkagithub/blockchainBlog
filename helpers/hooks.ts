import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export const useAuthRedirect = (route = "/login") => {
  const { isAuthenticated, isWeb3EnableLoading, user, logout } = useMoralis();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated)
      router
        .replace(route)
        .then(() => console.log("Unauthenticated. Redirected to Login."));
  }, [isAuthenticated, route]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isAuth: isAuthenticated && !isWeb3EnableLoading,
    user,
    logout,
  };
};
