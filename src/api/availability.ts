import { ScheduleAvailability } from "./schedules.d";
import { ENDPOINT, request } from "./endpoints";

interface ManageResponse {
  availability: ScheduleAvailability[] | ScheduleAvailability;
}

export interface AvailabilitySearchOptions {
  user_id?: string;
  schedule_id?: string;
}

/**
 * CRUD operations on the availability collection
 */
const manage = <Response>(
  token: string,
  payload: {
    action: "GET" | "CREATE" | "UPDATE" | "DELETE";
    schedule_id?: string;
    user_id?: string;
    availabilityPayload?: Partial<ScheduleAvailability>;
  }
) =>
  request<Response>(ENDPOINT.availability.manage, {
    token,
    body: payload
  });

export interface GetAvailabilityForResponse extends ManageResponse {
  availability: ScheduleAvailability[];
}

/**
 * Get a list of all availability matching the criteria
 */
export const getAvailabilityFor = (token: string, payload: AvailabilitySearchOptions) =>
  manage<GetAvailabilityForResponse>(token, {
    action: "GET",
    ...payload
  });

export interface CreateAvailabilityResponse extends ManageResponse {
  availability: ScheduleAvailability;
}

/**
 * Create a new availability
 */
export const createAvailability = (
  token: string,
  payload: Required<AvailabilitySearchOptions> & { availabilityPayload: Partial<ScheduleAvailability> }
) => manage<CreateAvailabilityResponse>(token, { action: "CREATE", ...payload });

export interface UpdateAvailabilityResponse extends ManageResponse {
  availability: ScheduleAvailability;
}

/**
 * Update a given availability
 */
export const updateAvailability = (
  token: string,
  payload: Required<AvailabilitySearchOptions> & { availabilityPayload: Partial<ScheduleAvailability> }
) => manage<UpdateAvailabilityResponse>(token, { action: "UPDATE", ...payload });

export interface DeleteAvailabilityResponse extends ManageResponse {
  availability: ScheduleAvailability;
}

/**
 * Delete a given availability
 */
export const deleteAvailability = (token: string, payload: Required<AvailabilitySearchOptions>) =>
  manage<DeleteAvailabilityResponse>(token, { action: "DELETE", ...payload });
