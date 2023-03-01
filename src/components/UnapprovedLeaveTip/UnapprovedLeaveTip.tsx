import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  selectLeaveList,
  getLeaveListAsync,
} from "../../store/slices/leaveSlice";

const App: React.FC = () => {
  const leaveList = useSelector(selectLeaveList);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getLeaveListAsync());
  }, []);

  const goLeaveListAll = () => {
    navigate("/leaveListAll");
  };

  const calcUnapprovedApply = () => {
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
      <span>目前有{calcUnapprovedApply()}条倒休申请未处理,</span>
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
