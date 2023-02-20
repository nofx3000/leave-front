import React, { useEffect, useState } from "react";
import { Space, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import { RoleInter } from "../../interface/RoleInterface";
import {
  selectRoleList,
  getRoleList,
  setOpenRoleFormModal,
} from "../../store/slices/roleSlice";
import RoleForm from "../../components/RoleForm/RoleForm";
import Tree from "../../components/Tree/Tree";
import { selectRightList } from "../../store/slices/rightSlice";
import { listToMap } from "../../utils/formaters";
import { RightInter } from "../../interface/RightInterface";
import _ from "lodash";

export type StatusType = "add" | "edit";

interface RoleListWithRightObjInter extends Omit<RoleInter, "right_list"> {
  right_list: RightInter[];
}

const App: React.FC = () => {
  const [status, setStatus] = useState<StatusType>("add");
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const roleList = useSelector(selectRoleList);
  const rightList = useSelector(selectRightList);
  const rightMap = listToMap<RightInter>(rightList as RightInter[]);
  const roleListWithRightObj: RoleListWithRightObjInter[] = (
    roleList as RoleInter[]
  ).map((role): RoleListWithRightObjInter => {
    let _role: RoleListWithRightObjInter = {} as any;
    _role.id = role.id;
    _role.role_name = role.role_name;
    _role.right_list = role.right_list.split(",").map((rightId) => {
      return rightMap[rightId as any];
    });
    return _role;
  });
  // console.log(roleListWithRightObj);

  const handleAdd = () => {
    setStatus("add");
    dispatch(setOpenRoleFormModal(true));
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/role/${id}`);
    dispatch(getRoleList());
  };

  const handleEdit = async (id: number) => {
    setStatus("edit");
    setRoleId(id);
    dispatch(setOpenRoleFormModal(true));
  };
  // 表结构
  const columns: ColumnsType<Partial<RoleInter>> = [
    {
      title: "角色名",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "角色权限",
      dataIndex: "right_list",
      key: "right_list",
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
        添加角色
      </Button>
      <Table columns={columns} dataSource={roleList} rowKey="id" />
      <RoleForm status={status} roleId={roleId ? roleId : undefined} />
    </>
  );
};

export default App;
