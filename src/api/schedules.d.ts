export interface Schedule {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  assignments: ScheduleDay[];
}

export interface ScheduleDay {
  date: string;
  cadetIds: string[];
}

export type ScheduleWithoutId = Omit<Schedule, "_id">;
