"use client";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Container,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useArticles } from "../hooks/useArticles";
import ArticleManager from "../components/ArticleManager";
import UserManagerTable from "../components/UserManagerTable";
import { useRouter } from "next/navigation";
import { useViewContext } from "../components/ViewContext";

export default function Home() {
  const { currentView } = useViewContext();
  const { articles, loading, error, fetchLatestArticles } = useArticles();
  const router = useRouter();

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  // 跳转到文章详情页
  const handleArticleClick = (articleId: number) => {
    router.push(`/article/${articleId}`);
  };

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <Container maxWidth="lg" className="flex-1 py-10">
            <Box textAlign="center" mb={6}>
              <Typography variant="h6" color="text.secondary">
                记录前端开发与技术成长
              </Typography>
            </Box>

            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ borderLeft: 4, borderColor: "primary.main", pl: 2 }}
                  >
                    最新文章
                  </Typography>
                  <Button
                    startIcon={<Refresh />}
                    onClick={fetchLatestArticles}
                    disabled={loading}
                    variant="outlined"
                    size="small"
                  >
                    刷新
                  </Button>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {loading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : articles.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            标题
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            摘要
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            创建时间
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            更新时间
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {articles.map((article) => (
                          <TableRow key={article.id} hover>
                            <TableCell
                              sx={{
                                fontWeight: "medium",
                                color: "primary.main",
                                cursor: "pointer",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => handleArticleClick(article.id)}
                            >
                              {article.title}
                            </TableCell>
                            <TableCell>{article.summary}</TableCell>
                            <TableCell sx={{ color: "text.secondary" }}>
                              {formatDate(article.created_at)}
                            </TableCell>
                            <TableCell sx={{ color: "text.secondary" }}>
                              {formatDate(article.updated_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                      暂无文章数据
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Container>
        );
      case "articles":
        return (
          <Container maxWidth="lg" className="flex-1 py-10">
            <ArticleManager
              articles={articles}
              onRefresh={fetchLatestArticles}
            />
          </Container>
        );
      case "about":
        return (
          <Container maxWidth="lg" className="flex-1 py-10">
            <Typography variant="h4" component="h1" gutterBottom>
              关于我
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              前端开发工程师，热爱技术分享...
            </Typography>
          </Container>
        );
      case "contact":
        return (
          <Container maxWidth="lg" className="flex-1 py-10">
            <Typography variant="h4" component="h1" gutterBottom>
              联系方式
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              邮箱：ricardo@example.com
            </Typography>
          </Container>
        );
      case "users":
        return (
          <Container maxWidth="lg" className="flex-1 py-10">
            <UserManagerTable />
          </Container>
        );
      default:
        return null;
    }
  };

  return <div className="min-h-screen flex flex-col">{renderContent()}</div>;
}
