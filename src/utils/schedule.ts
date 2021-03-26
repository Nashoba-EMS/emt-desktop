import { Schedule, ScheduleAvailability } from "../api/schedules.d";
import { UserWithoutPassword } from "../api/users.d";

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

  return schedule;
};
