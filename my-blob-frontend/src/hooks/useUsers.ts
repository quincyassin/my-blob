import { useState, useEffect } from "react";
import { User, userApiService } from "../services/userApi";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApiService.getUsers(page, pageSize);
      setUsers(data.users);
      setPagination({
        page: data.page,
        pageSize: data.page_size,
        total: data.total,
        totalPages: data.total_pages,
      });
    } catch (err) {
      setError("获取用户列表失败");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, status: number) => {
    try {
      await userApiService.updateUserStatus(userId, status);
      // 重新获取用户列表以更新状态
      await fetchUsers(pagination.page, pagination.pageSize);
      return true;
    } catch (err) {
      setError("更新用户状态失败");
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUserStatus,
  };
};
