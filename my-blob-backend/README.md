# My Blog Backend

基于 FastAPI 的博客后端 API 服务

## 技术栈

- **FastAPI**: 现代、快速的 Python Web 框架
- **SQLAlchemy**: ORM 数据库操作
- **MySQL**: 数据库
- **Pydantic**: 数据验证和序列化
- **Uvicorn**: ASGI 服务器

## 安装和运行

### 1拟环境
```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows
```

### 2. 安装依赖
```bash
pip install -r requirements.txt
```

### 3 配置数据库
确保 MySQL 服务运行，并创建数据库：
```sql
CREATE DATABASE my_blog CHARACTER SET utf8mb4TE utf8mb4_unicode_ci;
```

###4环境变量配置（可选）
```bash
export DATABASE_HOST=localhost
export DATABASE_PORT=336port DATABASE_USER=root
export DATABASE_PASSWORD=your_password
export DATABASE_NAME=my_blog
```

### 5. 运行服务
```bash
python main.py
# 或
uvicorn main:app --reload --host 0.0 --port800``

## API 接口

### 获取最新文章
- **GET** `/api/articles/latest`
- 返回最新的 10 篇文章

### 获取单篇文章
- **GET** `/api/articles/{article_id}`
- 根据文章 ID 获取详细信息

### API 文档
访问 `http://localhost:8000/docs` 查看自动生成的 API 文档

## 数据库表结构

### articles 表
- `id`: 主键
- `title`: 文章标题
- `summary`: 文章摘要
- `content`: 文章内容
- `created_at`: 创建时间
- `updated_at`: 更新时间 