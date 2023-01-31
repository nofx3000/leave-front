import { PersonInfoInter } from "./PeopleInterface";

export interface DivisionInter {
  id: number;
  name: string;
  people?: PersonInfoInter[];
}
