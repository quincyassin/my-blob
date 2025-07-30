from database import get_db
from models.user import User
from enums.userStatus import UserStatus

def create_test_users():
    db = next(get_db())
    
    # 检查是否已有用户数据
    existing_users = db.query(User).count()
    if existing_users > 0:
        print(f"数据库中已有 {existing_users} 个用户")
        return
    
    # 创建测试用户
    test_users = [
        {
            "username": "admin",
            "password": "123456",
            "name": "管理员",
            "age": 30,
            "phone": "13800138000",
            "email": "admin@example.com",
            "status": UserStatus.active.value
        },
        {
            "username": "user1",
            "password": "123456",
            "name": "张三",
            "age": 25,
            "phone": "13800138001",
            "email": "zhangsan@example.com",
            "status": UserStatus.active.value
        },
        {
            "username": "user2",
            "password": "123456",
            "name": "李四",
            "age": 28,
            "phone": "13800138002",
            "email": "lisi@example.com",
            "status": UserStatus.inactive.value
        },
        {
            "username": "user3",
            "password": "123456",
            "name": "王五",
            "age": 32,
            "phone": "13800138003",
            "email": "wangwu@example.com",
            "status": UserStatus.deleted.value
        },
        {
            "username": "user4",
            "password": "123456",
            "name": "赵六",
            "age": 26,
            "phone": "13800138004",
            "email": "zhaoliu@example.com",
            "status": UserStatus.active.value
        }
    ]
    
    for user_data in test_users:
        user = User(**user_data)
        db.add(user)
    
    db.commit()
    print(f"成功创建 {len(test_users)} 个测试用户")

if __name__ == "__main__":
    create_test_users() 