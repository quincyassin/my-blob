"""数据库服务配置"""

import os
from typing import List


class Settings:
    """配置类：用于存储数据库、API、CORS 等设置信息。"""

    # 数据库配置
    DATABASE_USER: str = os.getenv("DATABASE_USER", "root")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "123456")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "my_blog")
    DATABASE_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT: int = int(os.getenv("DATABASE_PORT", "3306"))

    @property
    def database_url(self) -> str:
        """返回数据库连接 URL。"""
        return (
            f"mysql+pymysql://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )

    # API 配置
    API_V1STR: str = "/api"
    PROJECT_NAME: str = "My Blog API"

    # CORS 配置
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Next.js 开发服务器
        "http://localhost"
    ]


# 创建全局设置实例
settings = Settings()
