import { useState, useEffect } from "react";
import { articlesApi } from "../services/articlesApi";
import {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "../services/articlesApi";

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取最新文章列表
  const fetchLatestArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await articlesApi.getLatestArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取文章失败");
    } finally {
      setLoading(false);
    }
  };

  // 创建文章
  const createArticle = async (articleData: CreateArticleRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newArticle = await articlesApi.createArticle(articleData);
      setArticles((prev) => [newArticle, ...prev]);
      return newArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建文章失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新文章
  const updateArticle = async (
    id: number,
    articleData: UpdateArticleRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedArticle = await articlesApi.updateArticle(id, articleData);
      setArticles((prev) =>
        prev.map((article) => (article.id === id ? updatedArticle : article))
      );
      return updatedArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新文章失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 删除文章
  const deleteArticle = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await articlesApi.deleteArticle(id);
      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除文章失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 获取单个文章
  const getArticle = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await articlesApi.getArticleById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取文章失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取文章列表
  useEffect(() => {
    fetchLatestArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    fetchLatestArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticle,
  };
};
