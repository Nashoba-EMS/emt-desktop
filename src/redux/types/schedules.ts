import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import {
  CreateScheduleResponse,
  DeleteScheduleResponse,
  GetAllSchedulesResponse,
  UpdateScheduleResponse
} from "../../api/schedules";

export const GET_ALL_SCHEDULES_START = "GET_ALL_SCHEDULES_START";
export const GET_ALL_SCHEDULES_SUCCESS = "GET_ALL_SCHEDULES_SUCCESS";
export const GET_ALL_SCHEDULES_FAILURE = "GET_ALL_SCHEDULES_FAILURE";
export const CREATE_SCHEDULE_START = "CREATE_SCHEDULE_START";
export const CREATE_SCHEDULE_SUCCESS = "CREATE_SCHEDULE_SUCCESS";
export const CREATE_SCHEDULE_FAILURE = "CREATE_SCHEDULE_FAILURE";
export const UPDATE_SCHEDULE_START = "UPDATE_SCHEDULE_START";
export const UPDATE_SCHEDULE_SUCCESS = "UPDATE_SCHEDULE_SUCCESS";
export const UPDATE_SCHEDULE_FAILURE = "UPDATE_SCHEDULE_FAILURE";
export const DELETE_SCHEDULE_START = "DELETE_SCHEDULE_START";
export const DELETE_SCHEDULE_SUCCESS = "DELETE_SCHEDULE_SUCCESS";
export const DELETE_SCHEDULE_FAILURE = "DELETE_SCHEDULE_FAILURE";

interface GetAllSchedulesStartAction {
  type: typeof GET_ALL_SCHEDULES_START;
}

type GetAllSchedulesSuccessAction = {
  type: typeof GET_ALL_SCHEDULES_SUCCESS;
} & SuccessResponse<GetAllSchedulesResponse>;

type GetAllSchedulesFailureAction = {
  type: typeof GET_ALL_SCHEDULES_FAILURE;
} & FailureResponse;

interface CreateScheduleStartAction {
  type: typeof CREATE_SCHEDULE_START;
}

type CreateScheduleSuccessAction = {
  type: typeof CREATE_SCHEDULE_SUCCESS;
} & SuccessResponse<CreateScheduleResponse>;

type CreateScheduleFailureAction = {
  type: typeof CREATE_SCHEDULE_FAILURE;
} & FailureResponse;

interface UpdateScheduleStartAction {
  type: typeof UPDATE_SCHEDULE_START;
}

type UpdateScheduleSuccessAction = {
  type: typeof UPDATE_SCHEDULE_SUCCESS;
} & SuccessResponse<UpdateScheduleResponse>;

type UpdateScheduleFailureAction = {
  type: typeof UPDATE_SCHEDULE_FAILURE;
} & FailureResponse;

interface DeleteScheduleStartAction {
  type: typeof DELETE_SCHEDULE_START;
}

type DeleteScheduleSuccessAction = {
  type: typeof DELETE_SCHEDULE_SUCCESS;
} & SuccessResponse<DeleteScheduleResponse>;

type DeleteScheduleFailureAction = {
  type: typeof DELETE_SCHEDULE_FAILURE;
} & FailureResponse;

export type SchedulesActionTypes =
  | GetAllSchedulesStartAction
  | GetAllSchedulesSuccessAction
  | GetAllSchedulesFailureAction
  | CreateScheduleStartAction
  | CreateScheduleSuccessAction
  | CreateScheduleFailureAction
  | UpdateScheduleStartAction
  | UpdateScheduleSuccessAction
  | UpdateScheduleFailureAction
  | DeleteScheduleStartAction
  | DeleteScheduleSuccessAction
  | DeleteScheduleFailureAction;

export type AsyncSchedulesActionTypes = ThunkAction<void, any, unknown, Action<string>>;
