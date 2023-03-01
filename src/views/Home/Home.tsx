import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getLeaveListUserAsync,
  selectLeaveListUser,
} from "../../store/slices/leaveSlice";
import {
  getRecordListUserAsync,
  selectRecordList,
} from "../../store/slices/recordSlice";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
import { App as globalAntd, Card } from "antd";
import { Calendar, Col, Row } from "antd";
import type { CalendarMode } from "antd/es/calendar/generateCalendar";
import type { Dayjs } from "dayjs";
import style from "./home.module.scss";
import RecordTimeline from "../../components/RecordTimeline/RecordTimeline";
import { UserInfoInter } from "../../interface/UserInterface";
import { LeaveInter } from "../../interface/LeaveInterface";
import { RecordInter } from "../../interface/RecordInterface";
import dateFormat from "dateformat";
import UnapprovedLeaveTip from "../../components/UnapprovedLeaveTip/UnapprovedLeaveTip";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;

  const leaveList = useSelector(selectLeaveListUser);
  const recordList = useSelector(selectRecordList);
  const userinfo: UserInfoInter | undefined = useSelector(selectUserinfo);

  useEffect(() => {
    if (userinfo) {
      dispatch(getLeaveListUserAsync(userinfo.id));
      dispatch(getRecordListUserAsync(userinfo.id));
    }
  }, [userinfo]);

  const calcApprovedLeaveLength = () => {
    if (leaveList) {
      return leaveList.reduce((prev, cur) => {
        if (cur.approved) {
          return prev + cur.length;
        }
        return prev;
      }, 0);
    }
    return "计算错误";
  };

  const calcUsedLeaveLength = () => {
    if (recordList) {
      return recordList.reduce((prev, cur) => {
        return prev + cur.length;
      }, 0);
    }
    return "计算错误";
  };

  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  return (
    <>
      <span className={style.title}>
        {userinfo?.role?.role_name} {userinfo?.realname}你好, 今天是
        {dateFormat(new Date(), "yyyy-mm-dd")}
      </span>
      <span style={{ marginRight: "3vw" }} className={style.title}>
        {(userinfo?.role?.role_name === "engineer" ||
          userinfo?.role?.role_name === "admin") && (
          <UnapprovedLeaveTip></UnapprovedLeaveTip>
        )}
      </span>

      <Row>
        <Col span={12}>
          <RecordTimeline></RecordTimeline>
        </Col>
        <Col span={12}>
          <Card style={{ height: "80vh", overflow: "auto" }}>
            <Calendar onPanelChange={onPanelChange} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default App;
