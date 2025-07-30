import { apiService } from "./api";
import { User, UserListResponse } from "./userApi";

export interface UserRegister {
  username: string;
  password: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
}

export interface ApiResponse {
  message: string;
  user_id: number;
}

// 认证服务类
class AuthService {
  private userKey: string = "auth_user";

  // 用户信息管理方法
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  clearUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.userKey);
    }
  }

  isAuthenticated(): boolean {
    return !!apiService.getToken();
  }

  // 用户认证相关API（不需要token）
  async register(userData: UserRegister): Promise<User> {
    return apiService.publicRequest<User>("/api/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: UserLogin): Promise<LoginResponse> {
    const response = await apiService.publicRequest<LoginResponse>(
      "/api/users/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    // 登录成功后保存token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.access_token);
    }

    return response;
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      this.clearUser();
    }
  }
}

// 导出单例实例
export const authService = new AuthService();
