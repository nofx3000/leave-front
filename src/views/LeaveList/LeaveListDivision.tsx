import React, { useEffect, useState } from "react";
import { Space, Switch, Table, Button, message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeaveInter } from "../../interface/LeaveInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import {
  setOpenLeaveFormModal,
  getLeaveListDivisionAsync,
  selectLeaveListDivision,
} from "../../store/slices/leaveSlice";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
import LeaveForm from "../../components/LeaveForm/LeaveForm";
import dateFormat from "dateformat";
import { UserInfoInter } from "../../interface/UserInterface";

export type StatusType = "add" | "edit";

const App: React.FC = () => {
  const [status, setStatus] = useState<StatusType>("add");
  const [leaveId, setLeaveId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const leaveList = useSelector(selectLeaveListDivision);
  const userinfo: UserInfoInter | undefined = useSelector(selectUserinfo);

  useEffect(() => {
    if (userinfo) {
      dispatch(getLeaveListDivisionAsync(userinfo.division_id));
    }
  }, [userinfo]);

  const handleAdd = () => {
    setStatus("add");
    dispatch(setOpenLeaveFormModal(true));
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/leave/${id}`);
    dispatch(
      getLeaveListDivisionAsync((userinfo as UserInfoInter).division_id)
    );
  };

  const handleEdit = async (id: number) => {
    setStatus("edit");
    setLeaveId(id);
    dispatch(setOpenLeaveFormModal(true));
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
      render: (_, { id, approved }) => (
        <Tag color={approved ? "green" : "red"}>
          {approved ? "通过" : "尚未通过"}
        </Tag>
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
