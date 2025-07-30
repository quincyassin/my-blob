from typing import Optional, List

from pydantic import BaseModel, EmailStr


class UserSchema(BaseModel):
    id: int
    username: str
    password: str
    name: str
    phone: str
    email: Optional[EmailStr]
    age: int
    status: int

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    users: List[UserSchema]
    total: int
    page: int
    page_size: int
    total_pages: int


class UserRegister(BaseModel):
    """用户注册请求模型"""
    username: str
    password: str
    name: str
    phone: str
    email: Optional[EmailStr] = None
    age: int


class UserLogin(BaseModel):
    """用户登录请求模型"""
    username: str
    password: str


class Token(BaseModel):
    """JWT Token响应模型"""
    access_token: str
    token_type: str
    user_id: int
    username: str


class UserResponse(BaseModel):
    """用户信息响应模型（不包含密码）"""
    id: int
    username: str
    name: str
    phone: str
    email: Optional[EmailStr]
    age: int
    status: int

    class Config:
        from_attributes = True
