import { useState, useEffect, useCallback } from "react";
import { authService, UserRegister, UserLogin } from "../services/authService";
import { User } from "../services/userApi";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 初始化认证状态
  useEffect(() => {
    const initAuth = () => {
      const user = authService.getUser();

      setAuthState({
        user,
        isAuthenticated: authService.isAuthenticated(),
        isLoading: false,
      });
    };

    initAuth();
  }, []);

  // 监听 localStorage 变化，确保状态同步
  useEffect(() => {
    const handleStorageChange = () => {
      const user = authService.getUser();
      setAuthState({
        user,
        isAuthenticated: authService.isAuthenticated(),
        isLoading: false,
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 登录
  const login = useCallback(async (credentials: UserLogin): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authService.login(credentials);

      // 获取用户信息（这里简化处理，实际可以从token中解析或调用用户信息接口）
      const user: User = {
        id: response.user_id,
        username: response.username,
        name: response.username, // 暂时使用用户名作为显示名称
        phone: "",
        age: 0,
        status: 1,
      };

      authService.setUser(user);

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // 触发全局事件，通知其他组件状态已更新
      console.log("Dispatching authStateChanged event", {
        isAuthenticated: true,
        user,
      });
      window.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: { isAuthenticated: true, user },
        })
      );

      // 确保状态更新完成
      return new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // 注册
  const register = useCallback(
    async (userData: UserRegister): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const user = await authService.register(userData);

        setAuthState({
          user,
          isAuthenticated: false, // 注册后需要登录
          isLoading: false,
        });
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    []
  );

  // 登出
  const logout = useCallback(() => {
    authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
