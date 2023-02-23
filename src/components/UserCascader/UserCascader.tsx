import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cascader, Tag } from "antd";
import { App as globalAntd } from "antd";
import { selectUserList } from "../../store/slices/userinfoSlice";
import { UserInfoInter } from "../../interface/UserInterface";
import { StatusType } from "../../views/TaskList/TaskList";
import { listToMap } from "../../utils/formaters";
import axios from "axios";

interface UserCascaderProps {
  status: StatusType;
  operator_list?: string;
  trigger: boolean;
  onTriggered: (value: any) => void;
}

const App: React.FC<UserCascaderProps> = (props) => {
  const { trigger, onTriggered, status, operator_list } = props;
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const [userListByDivision, setUserListByDivision] = useState([]);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const userList = useSelector(selectUserList);
  const userMap = listToMap(userList as UserInfoInter[]);

  useEffect(() => {
    if (status === "edit" && operator_list) {
      setSelectedList(operator_list.split(","));
    } else {
      setSelectedList([]);
    }
  }, [status, operator_list]);

  useEffect(() => {
    // 控制点击提交时UserCascader向外给form.item赋值
    if (trigger === true) {
      onTriggered(selectedList);
    }
  }, [trigger]);

  useEffect(() => {
    const getUserListByDivsion = async () => {
      const res = await axios.get("/user/division");
      if (res.data.errno === 0) {
        setUserListByDivision(res.data.data);
        console.log(res.data.data);
      } else {
        message.error("获取级联选择器数据失败");
      }
    };
    getUserListByDivsion();
  }, []);

  const onChange = (value: string[]) => {
    if (value.length < 2) return;
    console.log(value[value.length - 1]);
    setSelectedList([...selectedList, value[value.length - 1]]);
  };

  const onClose = (id: string) => {
    setSelectedList([...selectedList.filter((_id) => _id !== id)]);
  };

  return (
    <>
      {selectedList.map((id: string) => (
        <Tag
          closable
          onClose={() => {
            onClose(id);
          }}
          key={id}
        >
          {userMap[id as any].realname}
        </Tag>
      ))}
      <Cascader
        options={userListByDivision}
        placeholder="Please select"
        expandTrigger="hover"
        onChange={(e: any) => {
          onChange(e);
        }}
        fieldNames={{ label: "realname", value: "id", children: "users" }}
      />
    </>
  );
};

export default App;
