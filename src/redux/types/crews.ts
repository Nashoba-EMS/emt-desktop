import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import { CreateCrewResponse, DeleteCrewResponse, GetAllCrewsResponse, UpdateCrewResponse } from "../../api/crews";

export const GET_ALL_CREWS_START = "GET_ALL_CREWS_START";
export const GET_ALL_CREWS_SUCCESS = "GET_ALL_CREWS_SUCCESS";
export const GET_ALL_CREWS_FAILURE = "GET_ALL_CREWS_FAILURE";
export const CREATE_CREW_START = "CREATE_CREW_START";
export const CREATE_CREW_SUCCESS = "CREATE_CREW_SUCCESS";
export const CREATE_CREW_FAILURE = "CREATE_CREW_FAILURE";
export const UPDATE_CREW_START = "UPDATE_CREW_START";
export const UPDATE_CREW_SUCCESS = "UPDATE_CREW_SUCCESS";
export const UPDATE_CREW_FAILURE = "UPDATE_CREW_FAILURE";
export const DELETE_CREW_START = "DELETE_CREW_START";
export const DELETE_CREW_SUCCESS = "DELETE_CREW_SUCCESS";
export const DELETE_CREW_FAILURE = "DELETE_CREW_FAILURE";

interface GetAllCrewsStartAction {
  type: typeof GET_ALL_CREWS_START;
}

type GetAllCrewsSuccessAction = {
  type: typeof GET_ALL_CREWS_SUCCESS;
} & SuccessResponse<GetAllCrewsResponse>;

type GetAllCrewsFailureAction = {
  type: typeof GET_ALL_CREWS_FAILURE;
} & FailureResponse;

interface CreateCrewStartAction {
  type: typeof CREATE_CREW_START;
}

type CreateCrewSuccessAction = {
  type: typeof CREATE_CREW_SUCCESS;
} & SuccessResponse<CreateCrewResponse>;

type CreateCrewFailureAction = {
  type: typeof CREATE_CREW_FAILURE;
} & FailureResponse;

interface UpdateCrewStartAction {
  type: typeof UPDATE_CREW_START;
}

type UpdateCrewSuccessAction = {
  type: typeof UPDATE_CREW_SUCCESS;
} & SuccessResponse<UpdateCrewResponse>;

type UpdateCrewFailureAction = {
  type: typeof UPDATE_CREW_FAILURE;
} & FailureResponse;

interface DeleteCrewStartAction {
  type: typeof DELETE_CREW_START;
}

type DeleteCrewSuccessAction = {
  type: typeof DELETE_CREW_SUCCESS;
} & SuccessResponse<DeleteCrewResponse>;

type DeleteCrewFailureAction = {
  type: typeof DELETE_CREW_FAILURE;
} & FailureResponse;

export type CrewsActionTypes =
  | GetAllCrewsStartAction
  | GetAllCrewsSuccessAction
  | GetAllCrewsFailureAction
  | CreateCrewStartAction
  | CreateCrewSuccessAction
  | CreateCrewFailureAction
  | UpdateCrewStartAction
  | UpdateCrewSuccessAction
  | UpdateCrewFailureAction
  | DeleteCrewStartAction
  | DeleteCrewSuccessAction
  | DeleteCrewFailureAction;

export type AsyncCrewsActionTypes = ThunkAction<void, any, unknown, Action<string>>;
