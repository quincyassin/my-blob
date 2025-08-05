"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Fade,
  Grow,
  Paper,
  Tooltip,
  Fab,
  Container,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Article as ArticleIcon,
  AccessTime,
  Update,
  Description,
  Title,
} from "@mui/icons-material";
import { useArticles } from "../hooks/useArticles";
import {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "../services/articlesApi";

interface ArticleManagerProps {
  articles: Article[];
  onRefresh: () => void;
}

export default function ArticleManager({
  articles,
  onRefresh,
}: ArticleManagerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    user_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createArticle, updateArticle, deleteArticle } = useArticles();

  const handleOpenDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        summary: article.summary,
        content: article.content || "",
        user_id: article.user_id,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        summary: "",
        content: "",
        user_id: 0,
      });
    }
    setOpenDialog(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingArticle(null);
    setFormData({
      title: "",
      summary: "",
      content: "",
      user_id: 0,
    });
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.summary.trim()) {
      setError("标题和摘要不能为空");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingArticle) {
        const updateData: UpdateArticleRequest = {
          title: formData.title,
          summary: formData.summary,
          content: formData.content || undefined,
        };
        await updateArticle(editingArticle.id, updateData);
      } else {
        const userStr = localStorage.getItem("auth_user");
        if (!userStr) {
          setError("用户未登录");
        }
        const user = userStr ? JSON.parse(userStr) : null;
        const createData: CreateArticleRequest = {
          title: formData.title,
          summary: formData.summary,
          content: formData.content || undefined,
          user_id: user.id,
        };
        await createArticle(createData);
      }

      handleCloseDialog();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (article: Article) => {
    if (!confirm(`确定要删除文章"${article.title}"吗？`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteArticle(article.id);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "刚刚";
    if (diffInHours < 24) return `${diffInHours}小时前`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前`;
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 3 }}>
      <Container maxWidth="xl">
        {/* 页面标题区域 */}
        <Box
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            📝 文章管理中心
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            管理你的博客文章，创建精彩内容
          </Typography>
        </Box>

        {/* 统计信息 */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap={3}
          >
            <Box textAlign="center">
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {articles.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                总文章数
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h4"
                color="success.main"
                sx={{ fontWeight: "bold" }}
              >
                {
                  articles.filter(
                    (a) =>
                      new Date(a.updated_at) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </Typography>
              <Typography variant="body1" color="text.secondary">
                本周更新
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h4"
                color="info.main"
                sx={{ fontWeight: "bold" }}
              >
                {articles.length > 0
                  ? Math.round(
                      articles.reduce(
                        (acc, a) => acc + (a.content?.length || 0),
                        0
                      ) / articles.length
                    )
                  : 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                平均字数
              </Typography>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* 文章列表 */}
        {articles.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))"
            gap={3}
          >
            {articles.map((article, index) => (
              <Grow in timeout={300 + index * 100} key={article.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        <ArticleIcon />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {article.title}
                        </Typography>
                        <Chip
                          label={`ID: ${article.id}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 2 }}
                    >
                      {article.summary}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" alignItems="center" mb={1}>
                      <AccessTime
                        fontSize="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        创建: {getTimeAgo(article.created_at)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={2}>
                      <Update
                        fontSize="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        更新: {getTimeAgo(article.updated_at)}
                      </Typography>
                    </Box>

                    {article.content && (
                      <Chip
                        icon={<Description />}
                        label={`${article.content.length} 字符`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Tooltip title="编辑文章">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(article)}
                        disabled={loading}
                        sx={{
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "white",
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="删除文章">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(article)}
                        disabled={loading}
                        sx={{
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "white",
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grow>
            ))}
          </Box>
        ) : (
          <Paper sx={{ p: 8, textAlign: "center", borderRadius: 3 }}>
            <ArticleIcon
              sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              暂无文章
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              点击右下角的按钮创建你的第一篇文章
            </Typography>
          </Paper>
        )}

        {/* 浮动新建按钮 */}
        <Fab
          color="primary"
          aria-label="新建文章"
          onClick={() => handleOpenDialog()}
          disabled={loading}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          <Add />
        </Fab>
      </Container>

      {/* 新建/编辑对话框 */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {editingArticle ? <Edit /> : <Add />}
          {editingArticle ? "编辑文章" : "新建文章"}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="文章标题"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <Title sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="文章摘要"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              margin="normal"
              required
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <Description sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="文章内容"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              margin="normal"
              multiline
              rows={8}
              placeholder="在这里输入文章的详细内容..."
              InputProps={{
                startAdornment: (
                  <ArticleIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={loading}
            variant="outlined"
            startIcon={<Cancel />}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
            sx={{
              px: 3,
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            {loading ? "保存中..." : "保存"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
