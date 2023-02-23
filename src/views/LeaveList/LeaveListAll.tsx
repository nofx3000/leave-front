import React, { useEffect, useState } from "react";
import { Space, Switch, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeaveInter } from "../../interface/LeaveInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import {
  setOpenLeaveFormModal,
  getLeaveListAsync,
  selectLeaveList,
} from "../../store/slices/leaveSlice";
import LeaveForm from "../../components/LeaveForm/LeaveForm";
import dateFormat from "dateformat";

export type StatusType = "add" | "edit";

const App: React.FC = () => {
  const [status, setStatus] = useState<StatusType>("add");
  const [leaveId, setLeaveId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const leaveList = useSelector(selectLeaveList);

  useEffect(() => {
    dispatch(getLeaveListAsync());
  }, []);
  console.log(leaveList);

  const handleAdd = () => {
    setStatus("add");
    dispatch(setOpenLeaveFormModal(true));
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/leave/${id}`);
    dispatch(getLeaveListAsync());
  };

  const handleEdit = async (id: number) => {
    setStatus("edit");
    setLeaveId(id);
    dispatch(setOpenLeaveFormModal(true));
  };

  const onSwtichChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  // 表结构
  const columns: ColumnsType<LeaveInter> = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "中队",
      key: "division",
      render: (_, { user }) => <span>{user?.division?.realname}</span>,
    },
    {
      title: "时长(小时)",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "作业员",
      key: "operator",
      render: (_, { user }) => <span>{user?.realname}</span>,
    },
    {
      title: "关联任务",
      key: "task",
      render: (_, { task }) => <span>{task?.task_name}</span>,
    },
    {
      title: "备注",
      key: "comment",
      dataIndex: "comment",
    },
    {
      title: "申请时间",
      key: "created_at",
      render: (_, { created_at }) => (
        <span>{dateFormat(created_at, "yyyy-mm-dd")}</span>
      ),
    },
    {
      title: "审核状态",
      key: "approved",
      render: (_, { approved }) => (
        <Switch checked={approved} onChange={onSwtichChange} />
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
        申请调休
      </Button>
      <Table columns={columns} dataSource={leaveList} rowKey="id" />
      <LeaveForm status={status} leaveId={leaveId ? leaveId : undefined} />
    </>
  );
};

export default App;
