from sqlalchemy import Column, Integer, String
from models.article import Base

from enums.userStatus import UserStatus

class User(Base) :
    __tablename__ = "users" #表名
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    password = Column(String(100))
    name = Column(String(50))
    age = Column(Integer)
    phone = Column(String(20))
    email = Column(String(100))
    status = Column(Integer, default=UserStatus.active.value)


