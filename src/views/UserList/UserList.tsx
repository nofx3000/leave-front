import React, { useEffect, useState } from "react";
import { Space, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserInfoInter } from "../../interface/UserInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import { RoleInter } from "../../interface/RoleInterface";
import { setOpenModel } from "../../store/slices/userinfoSlice";
import UserForm from "../../components/UserForm/UserForm";

const formatCatagory = (catagory: number) => {
  switch (catagory) {
    case 0:
      return "干部";
    case 1:
      return "军士";
    case 2:
      return "文职";
    default:
      break;
  }
};

const roleIdToRoleName = (
  roleid: number,
  roleList: RoleInter[]
): string | void => {
  const role: RoleInter | undefined = roleList.find((item) => {
    return item.id === roleid;
  });
  if (role) {
    return role.role_name;
  }
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userList, setUserList] = useState<Partial<UserInfoInter>[]>([]);
  const [roleList, setRoleList] = useState<RoleInter[]>([]);

  useEffect(() => {
    // 获取用户列表
    const getUserList = async () => {
      const res = await axios.get("/user");
      console.log("用户列表", res.data.data);
      await setUserList(res.data.data);
    };
    getUserList();
    // 获取角色列表
    const getRoleList = async () => {
      const res = await axios.get("/role");
      await setRoleList(res.data.data);
      console.log("角色列表", roleList);
    };
    getRoleList();
  }, []);

  const showModal = () => {
    dispatch(setOpenModel(true));
  };

  // 表结构
  const columns: ColumnsType<Partial<UserInfoInter>> = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "真实姓名",
      dataIndex: "realname",
      key: "realname",
    },
    {
      title: "人员类别",
      key: "tags",
      dataIndex: "catagory",
      render: (_, { catagory }) => <>{formatCatagory(catagory as number)}</>,
    },
    {
      title: "角色",
      key: "role_id",
      dataIndex: "role_id",
      render: (_, { role_id }) => (
        <>{roleIdToRoleName(role_id as number, roleList)}</>
      ),
    },
    {
      title: "操作",
      key: "option",
      render: (_, record) => (
        <Space size="middle">
          <a>編輯</a>
          <a>刪除</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        添加用户
      </Button>
      <Table columns={columns} dataSource={userList} rowKey="id" />;
      <UserForm />
    </>
  );
};

export default App;
