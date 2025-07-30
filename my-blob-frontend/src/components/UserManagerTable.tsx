import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
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

const UserManagerTable: React.FC = () => {
  const { users, loading, error, pagination, fetchUsers, updateUserStatus } =
    useUsers();
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

  const handlePageChange = (event: unknown, newPage: number) => {
    fetchUsers(newPage + 1, pagination.pageSize);
  };

  const handlePageSizeChange = (event: any) => {
    const newPageSize = Number(event.target.value);
    fetchUsers(1, newPageSize);
  };

  if (loading && users.length === 0) {
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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>每页数量</InputLabel>
            <Select
              value={pagination.pageSize}
              label="每页数量"
              onChange={handlePageSizeChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="刷新用户列表">
            <IconButton
              onClick={() => fetchUsers(pagination.page, pagination.pageSize)}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 用户统计 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          用户统计
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <Typography variant="body1" color="success.main">
            正常用户: {users.filter((u: User) => u.status === 1).length}
          </Typography>
          <Typography variant="body1" color="warning.main">
            停用用户: {users.filter((u: User) => u.status === 2).length}
          </Typography>
          <Typography variant="body1" color="error.main">
            已删除: {users.filter((u: User) => u.status === 3).length}
          </Typography>
        </Box>
      </Paper>

      {/* 用户表格 */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>用户名</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>姓名</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>年龄</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>电话</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>邮箱</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>状态</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: User) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    opacity: user.status === 3 ? 0.6 : 1,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{getStatusChip(user.status)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 分页 */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.pageSize}
          page={pagination.page - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          labelRowsPerPage="每页行数:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} 共 ${count}`
          }
        />
      </Paper>

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

export default UserManagerTable;
