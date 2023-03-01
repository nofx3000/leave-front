import React, { useEffect, useState } from "react";
import { Space, Tooltip, Table, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeaveInter } from "../../interface/LeaveInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import {
  setOpenLeaveFormModal,
  getLeaveListUserAsync,
  selectLeaveListUser,
} from "../../store/slices/leaveSlice";
import {
  getRecordListUserAsync,
  selectRecordList,
} from "../../store/slices/recordSlice";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
import LeaveForm from "../../components/LeaveForm/LeaveForm";
import {
  calcApprovedLeaveLength,
  calcUsedLeaveLength,
} from "../../utils/calculator";
import dateFormat from "dateformat";
import { UserInfoInter } from "../../interface/UserInterface";
import { InfoCircleOutlined } from "@ant-design/icons";
import { RecordInter } from "../../interface/RecordInterface";

export type StatusType = "add" | "edit";

const App: React.FC = () => {
  const [status, setStatus] = useState<StatusType>("add");
  const [leaveId, setLeaveId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const leaveList = useSelector(selectLeaveListUser);
  const recordList = useSelector(selectRecordList);
  const userinfo: UserInfoInter | undefined = useSelector(selectUserinfo);

  useEffect(() => {
    if (userinfo) {
      dispatch(getLeaveListUserAsync(userinfo.id));
      dispatch(getRecordListUserAsync(userinfo.id));
    }
  }, [userinfo]);

  const handleAdd = () => {
    setStatus("add");
    dispatch(setOpenLeaveFormModal(true));
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/leave/${id}`);
    dispatch(getLeaveListUserAsync((userinfo as UserInfoInter).id));
  };

  const handleEdit = async (id: number) => {
    setStatus("edit");
    setLeaveId(id);
    dispatch(setOpenLeaveFormModal(true));
  };

  // // 表结构
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
      <span style={{ fontSize: "2vh", marginLeft: "2vw", color: "#108ee9" }}>
        当前可用批倒休时长为:{" "}
        {Number(calcApprovedLeaveLength(leaveList as LeaveInter[])) -
          Number(calcUsedLeaveLength(recordList as RecordInter[]))}
        小时
      </span>
      <Tooltip
        placement="right"
        title={`已获批倒休时长为: ${calcApprovedLeaveLength(
          leaveList as LeaveInter[]
        )}小时, 已使用倒休时长为: ${calcUsedLeaveLength(
          recordList as RecordInter[]
        )}小时`}
      >
        <InfoCircleOutlined style={{ marginLeft: "1vw" }} />
      </Tooltip>
      <Table columns={columns} dataSource={leaveList} rowKey="id" />
      <LeaveForm status={status} leaveId={leaveId ? leaveId : undefined} />
    </>
  );
};

export default App;
