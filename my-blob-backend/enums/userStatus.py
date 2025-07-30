import enum

class UserStatus(int, enum.Enum):
    active = 1
    inactive = 2
    deleted = 3