import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeaveInter } from "../../interface/LeaveInterface";

const App: React.FC = () => {
  const [leaveList, setLeaveList] = useState<LeaveInter[]>([]);
  const [unapproved, setUnapproved] = useState<number | string>(0);
  const navigate = useNavigate();
  useEffect(() => {
    const getLeaveList = async () => {
      const res = await axios.get("/leave");
      setLeaveList(res.data.data);
    };
    getLeaveList();
  }, []);

  useEffect(() => {
    setUnapproved(calcUnapprovedApply(leaveList));
  }, [leaveList]);

  const goLeaveListAll = () => {
    navigate("/leaveListAll");
  };

  const calcUnapprovedApply = (leaveList: LeaveInter[]) => {
    if (leaveList) {
      return leaveList.reduce((prev, cur) => {
        if (!cur.approved) {
          return ++prev;
        }
        return prev;
      }, 0);
    }
    return "计算错误";
  };

  return (
    <>
      <span>目前有{unapproved}条倒休申请未处理,</span>
      <span
        onClick={goLeaveListAll}
        style={{ color: "#108ee9", cursor: "pointer" }}
      >
        点击此处去处理
      </span>
    </>
  );
};

export default App;
