import { UserInfoInter } from "./UserInterface";

export interface DivisionInter {
  id: number;
  realname: string;
  users?: UserInfoInter[];
}
