import { LeaveInter } from "../interface/LeaveInterface";
import { RecordInter } from "../interface/RecordInterface";
export const calcApprovedLeaveLength = (leaveList: LeaveInter[]) => {
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

export const calcUsedLeaveLength = (recordList: RecordInter[]) => {
  if (recordList) {
    return recordList.reduce((prev, cur) => {
      return prev + cur.length;
    }, 0);
  }
  return "计算错误";
};
