from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers.article_controller import router as article_router
from routers.user_controller import router as user_router
from models.article import Base
from models.user import User
from database import engine

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建 FastAPI 应用
app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")
# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 注册路由
app.include_router(article_router)
app.include_router(user_router)

@app.get("/")
def read_root():
    return {"message": "Blog API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888) 