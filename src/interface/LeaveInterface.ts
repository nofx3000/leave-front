import { TaskInter } from "./TaskInterface";
import { UserInfoInter } from "./UserInterface";
import { DivisionInter } from "./DivisionInterface";

export interface LeaveInter {
  id: number;
  length: number;
  created_at: Date;
  user_id: number;
  user?: UserInfoInter;
  task_id: number;
  task?: TaskInter;
  comment?: string;
  approved: boolean;
}

interface _UserInfoInter extends UserInfoInter {
  leaves: LeaveInter[];
}

interface _DivisionInter extends DivisionInter {
  users: _UserInfoInter[];
}

export type LeaveListType = LeaveInter[];

export type LeaveListDivisionType = _DivisionInter;

export type LeaveListUserType = _UserInfoInter;
