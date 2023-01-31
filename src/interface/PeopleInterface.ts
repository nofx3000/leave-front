import { DivisionInter } from "./DivisionInterface";
import { RecordInter } from "./RecordInterface";
import { PhaseInter } from "./RecordInterface";

export interface PersonInfoInter {
  id?: number;
  name?: string;
  catagory?: number;
  work_age?: number;
  total_holiday?: number;
  division_id?: number;
  married?: boolean;
  not_with_parent?: boolean;
  not_with_partner?: boolean;
  comment?: string;
}

interface _Record extends RecordInter {
  phase: PhaseInter[];
}

export interface PersonInfoWithEverythingInter extends PersonInfoInter {
  record: _Record[];
  division: DivisionInter;
  spent: number;
}
