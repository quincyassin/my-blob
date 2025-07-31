from math import ceil
from typing import List, Optional, Dict, Any

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.user import User
from utils.auth import get_password_hash, verify_password, create_access_token
from enums.userStatus import UserStatus


class UserService:
    @staticmethod
    def get_users(db: Session) -> List[User]:
        """获取所有用户列表"""
        return db.query(User).order_by(User.status.asc()).all()
    
    @staticmethod
    def get_users_paginated(db: Session, page: int, page_size: int) -> Dict[str, Any]:
        """获取分页用户列表"""
        # 计算偏移量
        offset = (page - 1) * page_size
        
        # 获取总数
        total = db.query(User).filter(User.status != UserStatus.deleted.value).count()
        
        # 获取分页数据
        users = db.query(User).filter(User.status != UserStatus.deleted.value).order_by(User.status.asc()).offset(offset).limit(page_size).all()
        
        # 计算总页数
        total_pages = ceil(total / page_size)
        
        return {
            "users": users,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """根据ID获取用户"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def create_user(db: Session, user_data: dict) -> User:
        """创建新用户"""
        # 检查用户名是否已存在
        existing_user = db.query(User).filter(User.username == user_data["username"]).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已存在"
            )
        
        # 加密密码
        hashed_password = get_password_hash(user_data["password"])
        
        # 创建用户对象
        db_user = User(
            username=user_data["username"],
            password=hashed_password,
            name=user_data["name"],
            phone=user_data["phone"],
            email=user_data.get("email"),
            age=user_data["age"],
            status=UserStatus.active.value
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        """验证用户登录"""
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user
    
    @staticmethod
    def login_user(db: Session, username: str, password: str) -> Dict[str, Any]:
        """用户登录"""
        user = UserService.authenticate_user(db, username, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # 检查用户状态
        if user.status != UserStatus.active.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="用户账户已被停用或删除"
            )
        
        # 创建访问令牌
        access_token = create_access_token(
            data={"sub": str(user.id), "username": user.username}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "username": user.username
        }
    
    @staticmethod
    def update_user_status(db: Session, user_id: int, status: int) -> Optional[User]:
        """更新用户状态 (1: 正常, 2: 停用, 3: 删除)"""
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.status = status
            db.commit()
            db.refresh(user)
        return user