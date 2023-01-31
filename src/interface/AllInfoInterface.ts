import { DivisionInter } from "./DivisionInterface";
import { PersonInfoInter } from "./PeopleInterface";
import { RecordInter } from "./RecordInterface";
import { PhaseInter } from "./RecordInterface";

export type AllInfoInter = _DivisionInter[];

interface _DivisionInter extends DivisionInter {
  people?: _PersonInfoInter[];
}

interface _PersonInfoInter extends PersonInfoInter {
  record?: _RecordInter[];
}

interface _RecordInter extends RecordInter {
  phase?: PhaseInter[];
}
