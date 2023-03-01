import React, { useEffect, useRef, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserInfoInter } from "../../interface/UserInterface";
import axios from "axios";
import {
  calcApprovedLeaveLength,
  calcUsedLeaveLength,
} from "../../utils/calculator";

interface DataType {
  key: number;
  realname: string;
  division_name: string;
  available_length: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "#",
    dataIndex: "key",
    key: "id",
  },
  {
    title: "中队",
    dataIndex: "division_name",
    key: "division_name",
  },
  {
    title: "作业员",
    dataIndex: "realname",
    key: "realname",
  },
  {
    title: "可倒休时长",
    dataIndex: "available_length",
    key: "available_length",
  },
];

const App: React.FC = () => {
  const [dataList, setDataList] = useState<UserInfoInter[]>([]);
  const [formatedData, setFormatedData] = useState<DataType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tableRef = useRef(null);
  const timer = useRef(0);
  const formatDataList = (dataList: UserInfoInter[]) => {
    return dataList.map((data) => {
      let obj: DataType = {} as any;
      obj.available_length =
        Number(calcApprovedLeaveLength(data.leaves as any)) -
        Number(calcUsedLeaveLength(data.records as any));
      obj.realname = data.realname;
      obj.division_name = data.division?.realname as any;
      obj.key = data.id;
      return obj;
    });
  };

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/user/all");
      console.log(res.data.data);
      setDataList(res.data.data);
    };
    getData();
  }, []);

  useEffect(() => {
    setFormatedData(formatDataList(dataList));
  }, [dataList]);
  useEffect(() => {
    const length = Math.ceil(formatedData.length / 10);
    window.clearInterval(timer.current);
    if (currentPage > length) {
      setCurrentPage(1);
    }
    let _page = currentPage;
    timer.current = window.setInterval(() => {
      setCurrentPage(_page++);
    }, 5000);
    return () => {
      window.clearInterval(timer.current);
    };
  }, [tableRef, formatedData, currentPage]);

  return (
    <Table
      ref={tableRef}
      columns={columns}
      dataSource={formatedData}
      pagination={{ current: currentPage }}
    />
  );
};

export default App;
