from typing import List

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.article_service import ArticleService
from schemas.article import ArticleResponse, ArticleCreate, ArticleUpdate

router = APIRouter(
    prefix="/api/articles",
    tags=["articles"]
)


@router.get("/latest", response_model=List[ArticleResponse])
def get_latest_articles(db: Session = Depends(get_db)):
    # 获取最新文章列表
    try:
        articles = ArticleService.get_latest_articles(db)
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取文章失败: {str(e)}") from e


@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    # 根据 ID 获取文章
    article = ArticleService.get_article_by_id(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    return article


@router.post("/", response_model=ArticleResponse)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    # 创建新文章
    try:
        return ArticleService.create_article(
            db,
            title=article.title,
            summary=article.summary,
            content=article.content,
            user_id = article.user_id  # type: ignore
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建文章失败: {str(e)}") from e


@router.put("/{article_id}", response_model=ArticleResponse)
def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    # 更新文章
    updated_article = ArticleService.update_article(
        db,
        article_id,
        title=article.title,  # type: ignore
        summary=article.summary,  # type: ignore
        content=article.content  # type: ignore
    )
    if not updated_article:
        raise HTTPException(status_code=404, detail="文章不存在")
    return updated_article


@router.delete("/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    # 删除文章
    success = ArticleService.delete_article(db, article_id)
    if not success:
        raise HTTPException(status_code=404, detail="文章不存在")
    return {"message": "文章删除成功"}

