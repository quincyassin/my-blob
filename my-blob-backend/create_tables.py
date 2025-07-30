from database import engine
from models.article import Base
from models.user import User

def create_tables():
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    print("数据库表创建成功")

if __name__ == "__main__":
    create_tables() 