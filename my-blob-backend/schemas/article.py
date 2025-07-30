"""article schema

Defines Pydantic models for article creation, update, and response.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ArticleBase(BaseModel):
    """Base model for articles, shared by create and response."""
    title: str
    summary: str
    content: Optional[str] = None


class ArticleCreate(ArticleBase):
    """Schema for creating an article."""


class ArticleUpdate(BaseModel):
    """Schema for updating an article."""
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None


class ArticleResponse(ArticleBase):
    """Schema for article response including ID and timestamps."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        """配置 Pydantic 模型以使用 ORM 模式。"""
        from_attributes = True
