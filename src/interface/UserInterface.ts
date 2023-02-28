import { RoleInter } from "./RoleInterface";
import { LeaveInter } from "./LeaveInterface";
import { DivisionInter } from "./DivisionInterface";
import { RecordInter } from "./RecordInterface";
export interface UserInfoInter {
  id: number;
  username: string;
  password: string;
  role_id: number;
  realname: string;
  catagory: number;
  division_id: number;
  role?: RoleInter;
  leaves?: LeaveInter[];
  division?: DivisionInter;
  records?: RecordInter;
}

export interface LoginInter {
  username: string;
  password: string;
}
