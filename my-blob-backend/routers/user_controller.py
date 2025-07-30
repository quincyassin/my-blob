from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List

from schemas.user import UserSchema, UserListResponse, UserRegister, UserLogin, Token, UserResponse
from sqlalchemy.orm import Session
from database import get_db
from services.user_service import UserService
from models.user import User

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)


@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """用户注册"""
    try:
        user = UserService.create_user(db, user_data.dict())
        return UserResponse(
            id=user.id,
            username=user.username,
            name=user.name,
            phone=user.phone,
            email=user.email,
            age=user.age,
            status=user.status
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"注册失败: {str(e)}")


@router.post("/login", response_model=Token)
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """用户登录"""
    try:
        result = UserService.login_user(db, user_credentials.username, user_credentials.password)
        return Token(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"登录失败: {str(e)}")


@router.get("/list", response_model=UserListResponse)
def get_users(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    """获取用户列表（分页）"""
    return UserService.get_users_paginated(db, page, page_size)


@router.put("/{user_id}/status")
def update_user_status(user_id: int, status: int, db: Session = Depends(get_db)):
    """更新用户状态 (1: 正常, 2: 停用, 3: 删除)"""
    user = UserService.update_user_status(db, user_id, status)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    status_messages = {
        1: "用户已启用",
        2: "用户已停用", 
        3: "用户已删除"
    }
    
    return {"message": status_messages.get(status, "状态更新成功"), "user_id": user_id}
