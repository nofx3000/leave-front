import React from "react";
import { Button, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
import { useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userinfo = useSelector(selectUserinfo);
  const onLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Space wrap>
      <Avatar size="large" icon={<UserOutlined />} />
      <span>姓名: {userinfo?.realname}</span>
      <span>角色: {userinfo?.role?.role_name}</span>
      <Button danger onClick={onLogout}>
        注销
      </Button>
    </Space>
  );
};

export default App;
