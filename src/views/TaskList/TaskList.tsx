import React, { useEffect, useState } from "react";
import { Space, Table, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import { TaskInter } from "../../interface/TaskInterface";
import {
  setOpenTaskFormModal,
  selectTaskList,
  getTaskList,
} from "../../store/slices/taskSlice";
import { selectUserList } from "../../store/slices/userinfoSlice";
import TaskForm from "../../components/TaskForm/TaskForm";
import { listToMap } from "../../utils/formaters";
import { UserInfoInter } from "../../interface/UserInterface";

export type StatusType = "add" | "edit";

const App: React.FC = () => {
  const [status, setStatus] = useState<StatusType>("add");
  const [taskId, setTaskId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const taskList = useSelector(selectTaskList);
  const userList = useSelector(selectUserList);
  const userMap = listToMap(userList as UserInfoInter[]);

  const handleAdd = () => {
    setStatus("add");
    dispatch(setOpenTaskFormModal(true));
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/task/${id}`);
    dispatch(getTaskList());
  };

  const handleEdit = async (id: number) => {
    setStatus("edit");
    setTaskId(id);
    dispatch(setOpenTaskFormModal(true));
  };

  // 表结构
  const columns: ColumnsType<Partial<TaskInter>> = [
    {
      title: "任务名",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "参与人员",
      dataIndex: "operator_list",
      key: "operator_list",
      render: (_, { operator_list }) => (
        <div>
          {operator_list
            ?.split(",")
            .map(
              (id) =>
                userMap[id as any] && <Tag>{userMap[id as any].realname}</Tag>
            )}
        </div>
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
        添加任务
      </Button>
      <Table columns={columns} dataSource={taskList} rowKey="id" />
      <TaskForm status={status} taskId={taskId ? taskId : undefined} />
    </>
  );
};

export default App;
