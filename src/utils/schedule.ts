import moment from "moment";

import { Schedule, ScheduleAvailability } from "../api/schedules.d";
import { UserWithoutPassword } from "../api/users.d";

/**
 * Check if a day is valid for a given schedule (must be a weekday)
 */
const isDayValid = (schedule: Schedule, date: string | Date) => {
  const dateMoment = moment(date);
  const dayOfWeek = dateMoment.day();

  return dateMoment.isBetween(schedule.startDate, schedule.endDate, "day", "[]") && dayOfWeek !== 0 && dayOfWeek !== 6;
};

/**
 * Get all the valid days in a given schedule
 */
const getDaysInSchedule = (schedule: Schedule) => {
  const days: string[] = [];

  const currentMoment = moment(schedule.startDate);
  const endMoment = moment(schedule.endDate);

  while (currentMoment.isSameOrBefore(endMoment)) {
    if (isDayValid(schedule, currentMoment.toDate())) {
      days.push(currentMoment.format("YYYY-MM-DD"));
    }

    currentMoment.add(1, "days");
  }

  return days;
};

/**
 * Build a valid schedule based on availability and crew requirements
 */
export const buildSchedule = (
  schedule: Schedule,
  users: UserWithoutPassword[],
  userAvailability: ScheduleAvailability[]
): Schedule => {
  // Build maps to quickly look up users and availability by user ID
  const userIdToUser: {
    [_id: string]: UserWithoutPassword | undefined;
  } = {};
  const userIdToAvailability: {
    [_id: string]: ScheduleAvailability | undefined;
  } = {};

  users.forEach((user) => (userIdToUser[user._id] = user));
  userAvailability.forEach((availability) => (userIdToAvailability[availability.user_id] = availability));

  const days = getDaysInSchedule(schedule);
  console.log(days);

  const assignments: Schedule["assignments"] = [];

  assignments.push({
    date: schedule.startDate,
    cadet_ids: users.map((user) => user._id)
  });

  return {
    ...schedule,
    assignments
  };
};
