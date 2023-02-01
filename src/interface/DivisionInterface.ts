import { UserInfoInter } from "./UserInterface";

export interface DivisionInter {
  id: number;
  name: string;
  users?: UserInfoInter[];
}
