import React, { useEffect, useState } from "react";
import { Cascader } from "antd";
import { App as globalAntd } from "antd";
import axios from "axios";

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const onChange = (value: string[]) => {
  console.log(value);
};

const App: React.FC = () => {
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const [userListByDivision, setUserListByDivision] = useState([]);
  useEffect(() => {
    const getUserListByDivsion = async () => {
      const res = await axios.get("/user/division");
      console.log("useListByDivision", res.data.data);
      if (res.data.errno === 0) {
        setUserListByDivision(res.data.data);
      } else {
        message.error("获取级联选择器数据失败");
      }
    };
    getUserListByDivsion();
  }, []);
  return (
    <Cascader
      options={userListByDivision}
      placeholder="Please select"
      multiple
      onChange={(e: any) => {
        onChange(e);
      }}
      fieldNames={{ label: "realname", value: "id", children: "people" }}
    />
  );
};

export default App;
