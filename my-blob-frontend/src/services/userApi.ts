import { apiService } from "./api";
import { ApiResponse } from "./authService";

// 用户相关接口类型定义
export interface User {
  id: number;
  username: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  status: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

class UserApiService {
  async getUsers(
    page: number = 1,
    pageSize: number = 10
  ): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    return apiService.request<UserListResponse>(`/api/users/list?${params}`);
  }

  async updateUserStatus(userId: number, status: number): Promise<ApiResponse> {
    return apiService.request<ApiResponse>(
      `/api/users/${userId}/status?status=${status}`,
      {
        method: "PUT",
      }
    );
  }
}

export const userApiService = new UserApiService();
