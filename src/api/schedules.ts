import { Schedule } from "./schedules.d";
import { ENDPOINT, request } from "./endpoints";

interface ManageResponse {
  schedule: Schedule[] | Schedule;
}

/**
 * CRUD operations on the schedule collection
 */
const manage = <Response>(
  token: string,
  payload: {
    action: "GET" | "CREATE" | "UPDATE" | "DELETE";
    targetId?: string;
    schedulePayload?: Partial<Schedule>;
  }
) =>
  request<Response>(ENDPOINT.schedules.manage, {
    token,
    body: payload
  });

export interface GetAllSchedulesResponse extends ManageResponse {
  schedule: Schedule[];
}

/**
 * Get a list of all schedules
 */
export const getAllSchedules = (token: string) => manage<GetAllSchedulesResponse>(token, { action: "GET" });

export interface CreateScheduleResponse extends ManageResponse {
  schedule: Schedule;
}

/**
 * Create a new schedule
 */
export const createSchedule = (token: string, payload: { schedulePayload: Partial<Schedule> }) =>
  manage<CreateScheduleResponse>(token, { action: "CREATE", ...payload });

export interface UpdateScheduleResponse extends ManageResponse {
  schedule: Schedule;
}

/**
 * Update a given schedule
 */
export const updateSchedule = (token: string, payload: { targetId: string; schedulePayload: Partial<Schedule> }) =>
  manage<UpdateScheduleResponse>(token, { action: "UPDATE", ...payload });

export interface DeleteScheduleResponse extends ManageResponse {
  schedule: Schedule;
}

/**
 * Delete a given schedule
 */
export const deleteSchedule = (token: string, payload: { targetId: string }) =>
  manage<DeleteScheduleResponse>(token, { action: "DELETE", ...payload });
