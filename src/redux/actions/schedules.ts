import { AvailabilityApi, SchedulesApi } from "../../api";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import { Schedule, ScheduleAvailability } from "../../api/schedules.d";
import {
  SchedulesActionTypes,
  AsyncSchedulesActionTypes,
  GET_ALL_SCHEDULES_START,
  GET_ALL_SCHEDULES_SUCCESS,
  GET_ALL_SCHEDULES_FAILURE,
  CREATE_SCHEDULE_START,
  CREATE_SCHEDULE_SUCCESS,
  CREATE_SCHEDULE_FAILURE,
  UPDATE_SCHEDULE_START,
  UPDATE_SCHEDULE_SUCCESS,
  UPDATE_SCHEDULE_FAILURE,
  DELETE_SCHEDULE_START,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_FAILURE,
  GET_AVAILABILITY_START,
  GET_AVAILABILITY_SUCCESS,
  GET_AVAILABILITY_FAILURE,
  CREATE_AVAILABILITY_START,
  CREATE_AVAILABILITY_SUCCESS,
  CREATE_AVAILABILITY_FAILURE
} from "../types/schedules";

/**
 * Create a default start action
 */
const defaultStart = (type: SchedulesActionTypes["type"]) => (): SchedulesActionTypes =>
  ({
    type
  } as SchedulesActionTypes);

/**
 * Create a default success action
 */
const defaultSuccess = <Response>(type: SchedulesActionTypes["type"]) => (
  response: SuccessResponse<Response>
): SchedulesActionTypes =>
  ({
    type,
    ...response
  } as SchedulesActionTypes);

/**
 * Create a default failure action
 */
const defaultFailure = (type: SchedulesActionTypes["type"]) => (response: FailureResponse): SchedulesActionTypes =>
  ({
    type,
    ...response
  } as SchedulesActionTypes);

const getAllSchedulesStart = defaultStart(GET_ALL_SCHEDULES_START);
const getAllSchedulesSuccess = defaultSuccess<SchedulesApi.GetAllSchedulesResponse>(GET_ALL_SCHEDULES_SUCCESS);
const getAllSchedulesFailure = defaultFailure(GET_ALL_SCHEDULES_FAILURE);

/**
 * Get a list of all schedules
 */
export const getAllSchedules = (token: string): AsyncSchedulesActionTypes => async (dispatch) => {
  dispatch(getAllSchedulesStart());

  const response = await SchedulesApi.getAllSchedules(token);

  if (response.code === 200) {
    dispatch(getAllSchedulesSuccess(response));
  } else {
    dispatch(getAllSchedulesFailure(response));
  }
};

const createScheduleStart = defaultStart(CREATE_SCHEDULE_START);
const createScheduleSuccess = defaultSuccess<SchedulesApi.CreateScheduleResponse>(CREATE_SCHEDULE_SUCCESS);
const createScheduleFailure = defaultFailure(CREATE_SCHEDULE_FAILURE);

/**
 * Create a new schedule
 */
export const createSchedule = (token: string, schedulePayload: Partial<Schedule>): AsyncSchedulesActionTypes => async (
  dispatch
) => {
  dispatch(createScheduleStart());

  const response = await SchedulesApi.createSchedule(token, { schedulePayload });

  if (response.code === 200) {
    dispatch(createScheduleSuccess(response));
  } else {
    dispatch(createScheduleFailure(response));
  }
};

const updateScheduleStart = defaultStart(UPDATE_SCHEDULE_START);
const updateScheduleSuccess = defaultSuccess<SchedulesApi.UpdateScheduleResponse>(UPDATE_SCHEDULE_SUCCESS);
const updateScheduleFailure = defaultFailure(UPDATE_SCHEDULE_FAILURE);

/**
 * Update a schedule
 */
export const updateSchedule = (
  token: string,
  targetId: string,
  schedulePayload: Partial<Schedule>
): AsyncSchedulesActionTypes => async (dispatch) => {
  dispatch(updateScheduleStart());

  const response = await SchedulesApi.updateSchedule(token, { targetId, schedulePayload });

  if (response.code === 200) {
    dispatch(updateScheduleSuccess(response));
  } else {
    dispatch(updateScheduleFailure(response));
  }
};

const deleteScheduleStart = defaultStart(DELETE_SCHEDULE_START);
const deleteScheduleSuccess = defaultSuccess<SchedulesApi.DeleteScheduleResponse>(DELETE_SCHEDULE_SUCCESS);
const deleteScheduleFailure = defaultFailure(DELETE_SCHEDULE_FAILURE);

/**
 * Delete a schedule
 */
export const deleteSchedule = (token: string, targetId: string): AsyncSchedulesActionTypes => async (dispatch) => {
  dispatch(deleteScheduleStart());

  const response = await SchedulesApi.deleteSchedule(token, { targetId });

  if (response.code === 200) {
    dispatch(deleteScheduleSuccess(response));
  } else {
    dispatch(deleteScheduleFailure(response));
  }
};

const getAvailabilityStart = defaultStart(GET_AVAILABILITY_START);
const getAvailabilitySuccess = (
  searchOptions: AvailabilityApi.AvailabilitySearchOptions,
  response: SuccessResponse<AvailabilityApi.GetAvailabilityForResponse>
): SchedulesActionTypes => ({
  type: GET_AVAILABILITY_SUCCESS,
  searchOptions,
  ...response
});
const getAvailabilityFailure = defaultFailure(GET_AVAILABILITY_FAILURE);

/**
 * Get availability for a given schedule or user
 */
export const getAvailability = (
  token: string,
  searchOptions: AvailabilityApi.AvailabilitySearchOptions
): AsyncSchedulesActionTypes => async (dispatch) => {
  dispatch(getAvailabilityStart());

  const response = await AvailabilityApi.getAvailabilityFor(token, searchOptions);

  if (response.code === 200) {
    dispatch(getAvailabilitySuccess(searchOptions, response));
  } else {
    dispatch(getAvailabilityFailure(response));
  }
};

const createAvailabilityStart = defaultStart(CREATE_AVAILABILITY_START);
const createAvailabilitySuccess = defaultSuccess<AvailabilityApi.CreateAvailabilityResponse>(
  CREATE_AVAILABILITY_SUCCESS
);
const createAvailabilityFailure = defaultFailure(CREATE_AVAILABILITY_FAILURE);

/**
 * Create availability for a given schedule and user
 */
export const createAvailability = (
  token: string,
  searchOptions: Required<AvailabilityApi.AvailabilitySearchOptions>,
  availabilityPayload: Partial<ScheduleAvailability>
): AsyncSchedulesActionTypes => async (dispatch) => {
  dispatch(createAvailabilityStart());

  const response = await AvailabilityApi.createAvailability(token, { ...searchOptions, availabilityPayload });

  if (response.code === 200) {
    dispatch(createAvailabilitySuccess(response));
  } else {
    dispatch(createAvailabilityFailure(response));
  }
};
