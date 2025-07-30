'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress, 
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { ArrowBack, CalendarToday, Update } from '@mui/icons-material';
import { articlesApi } from '../../../services/articlesApi';
import { Article } from '../../../services/api';

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articleId = Number(params.id);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId || isNaN(articleId)) {
        setError('无效的文章ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await articlesApi.getArticleById(articleId);
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取文章失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          variant="outlined"
        >
          返回首页
        </Button>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          文章不存在
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          variant="outlined"
        >
          返回首页
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        返回首页
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {article.title}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {article.summary}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              icon={<CalendarToday />}
              label={`创建时间：${formatDate(article.created_at)}`}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<Update />}
              label={`更新时间：${formatDate(article.updated_at)}`}
              variant="outlined"
              size="small"
            />
          </Box>

          {article.content && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                文章内容
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    fontWeight: 'bold',
                    mt: 2,
                    mb: 1
                  },
                  '& p': {
                    mb: 1.5
                  }
                }}
              >
                {article.content}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}