import { apiService } from "./api";

// 文章相关接口类型定义
export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleRequest {
  title: string;
  summary: string;
  content?: string;
  user_id: number;
}

export interface UpdateArticleRequest {
  title?: string;
  summary?: string;
  content?: string;
}

class ArticlesApiService {
  // 获取最新文章列表
  async getLatestArticles(): Promise<Article[]> {
    return apiService.request<Article[]>("/api/articles/latest");
  }

  // 根据ID获取文章
  async getArticleById(id: number): Promise<Article> {
    return apiService.request<Article>(`/api/articles/${id}`);
  }

  // 创建新文章
  async createArticle(article: CreateArticleRequest): Promise<Article> {
    return apiService.request<Article>("/api/articles/", {
      method: "POST",
      body: JSON.stringify(article),
    });
  }

  // 更新文章
  async updateArticle(
    id: number,
    article: UpdateArticleRequest
  ): Promise<Article> {
    return apiService.request<Article>(`/api/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(article),
    });
  }

  // 删除文章
  async deleteArticle(id: number): Promise<{ message: string }> {
    return apiService.request<{ message: string }>(`/api/articles/${id}`, {
      method: "DELETE",
    });
  }
}

// 导出单例实例
export const articlesApi = new ArticlesApiService();
