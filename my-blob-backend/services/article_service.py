from sqlalchemy.orm import Session
from models.article import Article


class ArticleService:
    @staticmethod
    def get_latest_articles(db: Session):
        """取最新文章列表"""
        return db.query(Article).order_by(Article.created_at.desc()).limit(10).all()

    @staticmethod
    def get_article_by_id(db: Session, article_id: int):
        """据ID获取文章"""
        return db.query(Article).filter(Article.id == article_id).first()

    @staticmethod
    def create_article(db: Session, title: str, summary: str, content: str):
        """创建新文章"""
        article = Article(title=title, summary=summary, content=content)
        db.add(article)
        db.commit()
        db.refresh(article)
        return article

    @staticmethod
    def update_article(db: Session, article_id: int, title: str, summary: str, content: str):
        """修改文章"""
        article = db.query(Article).filter(Article.id == article_id).first()
        if article:
            article.title = title  # type: ignore
            article.summary = summary  # type: ignore
            article.content = content  # type: ignore
            db.commit()
            db.refresh(article)
        return article

    @staticmethod
    def delete_article(db: Session, article_id: int):
        """删除文章"""
        article = db.query(Article).filter(Article.id == article_id).first()
        if article:
            db.delete(article)
            db.commit()
            return True
        return False
