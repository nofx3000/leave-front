import { TaskInter } from "./TaskInterface";
import { UserInfoInter } from "./UserInterface";

export interface LeaveInter {
  length: number;
  created_at: Date;
  user_id: number;
  user?: UserInfoInter;
  task_id: number;
  task?: TaskInter;
  comment?: string;
  approved: boolean;
}
