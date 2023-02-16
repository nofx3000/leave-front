import React, { useEffect, useState } from "react";
import { Space, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserInfoInter } from "../../interface/UserInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import { RoleInter } from "../../interface/RoleInterface";
import {
  setOpenUserFormModal,
  selectUserList,
  getUserListAsync,
} from "../../store/slices/userinfoSlice";
import { selectRoleList } from "../../store/slices/roleSlice";
import UserForm from "../../components/UserForm/UserForm";
import { roleIdToRoleName, formatCatagory } from "../../utils/formaters";

export type StatusType = "add" | "edit";

const App: React.FC = () => {
  const [status, setStatus] = useState<StatusType>("add");
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector(selectUserList);
  const roleList = useSelector(selectRoleList);

  const handleAdd = () => {
    setStatus("add");
    dispatch(setOpenUserFormModal(true));
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/user/${id}`);
    dispatch(getUserListAsync());
  };

  const handleEdit = async (id: number) => {
    setStatus("edit");
    setUserId(id);
    dispatch(setOpenUserFormModal(true));
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
        <>{roleIdToRoleName(role_id as number, roleList as RoleInter[])}</>
      ),
    },
    {
      title: "操作",
      key: "option",
      render: (_, { id }) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleEdit(id as number);
            }}
          >
            編輯
          </a>
          <a
            onClick={() => {
              handleDelete(id as number);
            }}
          >
            刪除
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleAdd}>
        添加用户
      </Button>
      <Table columns={columns} dataSource={userList} rowKey="id" />
      <UserForm status={status} userId={userId ? userId : undefined} />
    </>
  );
};

export default App;
