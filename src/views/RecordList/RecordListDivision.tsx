import React, { useEffect, useState } from "react";
import { Space, Switch, Table, Button, message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RecordInter } from "../../interface/RecordInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import {
  setOpenRecordFormModal,
  getRecordListDivisionAsync,
  selectRecordList,
} from "../../store/slices/recordSlice";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
import RecordForm from "../../components/RecordForm/RecordForm";
import dateFormat from "dateformat";
import { UserInfoInter } from "../../interface/UserInterface";

export type StatusType = "add" | "edit";

const App: React.FC = () => {
  const [status, setStatus] = useState<StatusType>("add");
  const [recordId, setRecordId] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const recordList = useSelector(selectRecordList);
  const userinfo: UserInfoInter | undefined = useSelector(selectUserinfo);

  useEffect(() => {
    if (userinfo) {
      dispatch(getRecordListDivisionAsync(userinfo.division_id));
    }
  }, [userinfo]);

  const handleAdd = () => {
    setStatus("add");
    dispatch(setOpenRecordFormModal(true));
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/record/${id}`);
    dispatch(
      getRecordListDivisionAsync((userinfo as UserInfoInter).division_id)
    );
  };

  const handleEdit = async (id: number) => {
    setStatus("edit");
    setRecordId(id);
    dispatch(setOpenRecordFormModal(true));
  };

  // 表结构
  const columns: ColumnsType<Partial<RecordInter>> = [
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
      title: "备注",
      key: "comment",
      dataIndex: "comment",
    },
    {
      title: "倒休时间",
      key: "leave_at",
      render: (_, { leave_at }) => (
        <span>{dateFormat(leave_at, "yyyy-mm-dd")}</span>
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
        添加倒休记录
      </Button>
      <Table columns={columns} dataSource={recordList} rowKey="id" />
      <RecordForm status={status} recordId={recordId ? recordId : undefined} />
    </>
  );
};

export default App;
