import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { IUser } from "@/types/user-types";
import { AuthService } from "@/services/api";

export const useAuth = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await AuthService.checkSession();
        setUser(userData);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please log in again",
        });
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    login: AuthService.login,
    logout: AuthService.logout,
    register: AuthService.register,
  };
};
