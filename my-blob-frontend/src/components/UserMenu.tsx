import { User } from "@/services/userApi";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface UserMenuProps {
  user: User | null;
  handleLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, handleLogout }) => {
  const [isHover, setIsHover] = useState(false);

  const [isHidden, setIsHidden] = useState(false);

  const handleMouseClick = () => {
    setIsHidden(!isHidden);
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleClose = () => {};

  return (
    <>
      <Avatar
        sx={{ width: 40, height: 40, bgcolor: isHover ? blue[700] : blue[500] }}
        onClick={handleMouseClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {user?.name?.charAt(0)}
      </Avatar>
      {isHidden && (
        <Card
          sx={{
            position: "absolute",
            top: 65, // 控制卡片出现在头像下方
            right: 60,
            zIndex: 10,
            width: 200,
            boxShadow: 3,
            borderRadius: 6,
          }}
        >
          <IconButton
            size="large"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <CardContent sx={{ pt: 4 }}>
            <CardActions sx={{ justifyContent: "center" }}>
              个人资料
            </CardActions>
            <CardActions sx={{ justifyContent: "center" }}>设置</CardActions>
            <CardActions
              sx={{ justifyContent: "center" }}
              onClick={handleLogout}
            >
              退出登录
            </CardActions>
          </CardContent>
        </Card>
      )}
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          {user?.name || user?.username || "未命名用户"}
        </MenuItem>
        <MenuItem>个人资料</MenuItem>
        <MenuItem>设置</MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleLogout();
          }}
        >
          退出登录
        </MenuItem>
      </Menu> */}
    </>
  );
};
