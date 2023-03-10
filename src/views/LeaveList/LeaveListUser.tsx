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
  selectLeaveList,
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
  const leaveList = useSelector(selectLeaveList);
  console.log("leaveList", leaveList);

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

  // // ?????????
  const columns: ColumnsType<LeaveInter> = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "??????",
      key: "division",
      render: (_, { user }) => <span>{user?.division?.realname}</span>,
    },
    {
      title: "??????(??????)",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "?????????",
      key: "operator",
      render: (_, { user }) => <span>{user?.realname}</span>,
    },
    {
      title: "????????????",
      key: "task",
      render: (_, { task }) => <span>{task?.task_name}</span>,
    },
    {
      title: "??????",
      key: "comment",
      dataIndex: "comment",
    },
    {
      title: "????????????",
      key: "created_at",
      render: (_, { created_at }) => (
        <span>{dateFormat(created_at, "yyyy-mm-dd")}</span>
      ),
    },
    {
      title: "????????????",
      key: "approved",
      render: (_, { id, approved }) => (
        <Tag color={approved ? "green" : "red"}>
          {approved ? "??????" : "????????????"}
        </Tag>
      ),
    },
    {
      title: "??????",
      key: "option",
      render: (_, { id }) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleEdit(id as number);
            }}
          >
            ??????
          </a>
          <a
            onClick={() => {
              handleDelete(id as number);
            }}
          >
            ??????
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleAdd}>
        ????????????
      </Button>
      <span style={{ fontSize: "2vh", marginLeft: "2vw", color: "#108ee9" }}>
        ??????????????????????????????:{" "}
        {Number(calcApprovedLeaveLength(leaveList as LeaveInter[])) -
          Number(calcUsedLeaveLength(recordList as RecordInter[]))}
        ??????
      </span>
      <Tooltip
        placement="right"
        title={`????????????????????????: ${calcApprovedLeaveLength(
          leaveList as LeaveInter[]
        )}??????, ????????????????????????: ${calcUsedLeaveLength(
          recordList as RecordInter[]
        )}??????`}
      >
        <InfoCircleOutlined style={{ marginLeft: "1vw" }} />
      </Tooltip>
      <Table columns={columns} dataSource={leaveList} rowKey="id" />
      <LeaveForm status={status} leaveId={leaveId ? leaveId : undefined} />
    </>
  );
};

export default App;
