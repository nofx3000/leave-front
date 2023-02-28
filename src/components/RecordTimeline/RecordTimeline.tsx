import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getLeaveListUserAsync,
  selectLeaveList,
} from "../../store/slices/leaveSlice";
import {
  getRecordListUserAsync,
  selectRecordList,
} from "../../store/slices/recordSlice";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
import { Timeline, TimelineItemProps } from "antd";
import { UserInfoInter } from "../../interface/UserInterface";
import { LeaveInter } from "../../interface/LeaveInterface";
import { RecordInter } from "../../interface/RecordInterface";
import dateFormat from "dateformat";

type _TimelineItemProps = TimelineItemProps & { time?: string | Date };

const App: React.FC = () => {
  const leaveList = useSelector(selectLeaveList);
  const recordList = useSelector(selectRecordList);
  const userinfo: UserInfoInter | undefined = useSelector(selectUserinfo);
  const [timelineData, setTimelineData] = useState<_TimelineItemProps[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (userinfo) {
      dispatch(getLeaveListUserAsync(userinfo.id));
      dispatch(getRecordListUserAsync(userinfo.id));
    }
  }, [userinfo]);

  useEffect(() => {
    setTimelineData(leaveListToTimeline() as _TimelineItemProps[]);
  }, [leaveList, recordList]);

  const leaveListToTimeline = () => {
    let data = leaveList?.reduce(
      (prev: _TimelineItemProps[], cur: LeaveInter) => {
        if (cur.approved) {
          const item: _TimelineItemProps = {
            color: "green",
            children: `${dateFormat(cur.created_at, "yyyy-mm-dd")}获批倒休时间${
              cur.length
            }小时`,
            time: new Date(cur.created_at),
            position: "right",
          };
          return [...prev, item];
        }
        return prev;
      },
      []
    );
    data = recordList?.reduce(
      (prev: _TimelineItemProps[], cur: RecordInter) => {
        const item: _TimelineItemProps = {
          color: "red",
          children: `${dateFormat(cur.leave_at, "yyyy-mm-dd")}使用倒休${
            cur.length
          }小时`,
          time: new Date(cur.leave_at),
          position: "left",
        };
        return [...prev, item];
      },
      data as _TimelineItemProps[]
    );

    return data?.sort((a, b) => Number(a.time) - Number(b.time));
  };

  return <Timeline items={timelineData} mode="alternate" />;
};

export default App;
