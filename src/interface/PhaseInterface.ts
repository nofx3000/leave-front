import { PersonInfoInter } from "./PeopleInterface";
import { RecordInter } from "./RecordInterface";
import { PhaseInter } from "./RecordInterface";

interface _RecordInter extends RecordInter {
  people: PersonInfoInter;
}

export interface TodayPhaseInter extends PhaseInter {
  record: _RecordInter;
}
