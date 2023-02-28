import { UserInfoInter } from "./UserInterface";
export interface RecordInter {
  id: number;
  length: number;
  leave_at: Date;
  user_id: number;
  user?: UserInfoInter;
  comment?: string;
}
