import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useUsers } from "../hooks/useUsers";
import { User } from "../services/userApi";

const UserManager: React.FC = () => {
  const { users, loading, error, fetchUsers, updateUserStatus } = useUsers();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const getStatusChip = (status: number) => {
    switch (status) {
      case 1:
        return <Chip label="正常" color="success" size="small" />;
      case 2:
        return <Chip label="停用" color="warning" size="small" />;
      case 3:
        return <Chip label="已删除" color="error" size="small" />;
      default:
        return <Chip label="未知" color="default" size="small" />;
    }
  };

  const handleActivate = async (user: User) => {
    setActionLoading(user.id);
    const success = await updateUserStatus(user.id, 1);
    setActionLoading(null);
    if (success) {
      // 可以添加成功提示
    }
  };

  const handleDeactivate = async (user: User) => {
    setActionLoading(user.id);
    const success = await updateUserStatus(user.id, 2);
    setActionLoading(null);
    if (success) {
      // 可以添加成功提示
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      setActionLoading(selectedUser.id);
      const success = await updateUserStatus(selectedUser.id, 3);
      setActionLoading(null);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        // 可以添加成功提示
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 页面标题 */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          用户管理
        </Typography>
        <Tooltip title="刷新用户列表">
          <IconButton onClick={() => fetchUsers()} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 用户统计 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <Typography variant="h6" color="success.main">
            正常用户: {users.filter((u: User) => u.status === 1).length}
          </Typography>
          <Typography variant="h6" color="warning.main">
            停用用户: {users.filter((u: User) => u.status === 2).length}
          </Typography>
          <Typography variant="h6" color="error.main">
            已删除: {users.filter((u: User) => u.status === 3).length}
          </Typography>
        </Box>
      </Paper>

      {/* 用户列表 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {users.map((user: User) => (
          <Box key={user.id}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
                opacity: user.status === 3 ? 0.6 : 1,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="h2" noWrap>
                    {user.name}
                  </Typography>
                  {getStatusChip(user.status)}
                </Box>

                <Typography color="text.secondary" gutterBottom>
                  用户名: {user.username}
                </Typography>

                <Typography color="text.secondary" gutterBottom>
                  年龄: {user.age}岁
                </Typography>

                <Typography color="text.secondary" gutterBottom>
                  电话: {user.phone}
                </Typography>

                {user.email && (
                  <Typography color="text.secondary" gutterBottom>
                    邮箱: {user.email}
                  </Typography>
                )}

                {/* 操作按钮 */}
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {user.status === 2 && (
                    <Tooltip title="启用用户">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleActivate(user)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <CheckCircleIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}

                  {user.status === 1 && (
                    <Tooltip title="停用用户">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleDeactivate(user)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <CancelIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}

                  {user.status !== 3 && (
                    <Tooltip title="删除用户">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="warning" />
            确认删除用户
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除用户 "{selectedUser?.name}" 吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>取消</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={actionLoading === selectedUser?.id}
          >
            {actionLoading === selectedUser?.id ? (
              <CircularProgress size={16} />
            ) : (
              "删除"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 空状态 */}
      {users.length === 0 && !loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="text.secondary">
            暂无用户数据
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserManager;
