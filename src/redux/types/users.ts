import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import {
  CreateUserResponse,
  DeleteUserResponse,
  GetAllUsersResponse,
  LoginResponse,
  UpdateUserResponse
} from "../../api/users";

export const LOAD_SESSION_DONE = "LOAD_SESSION_DONE";
export const LOGIN_RESET = "LOGIN_RESET";
export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

export const GET_ALL_USERS_START = "GET_ALL_USERS_START";
export const GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS";
export const GET_ALL_USERS_FAILURE = "GET_ALL_USERS_FAILURE";
export const CREATE_USER_START = "CREATE_USER_START";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";
export const UPDATE_USER_START = "UPDATE_USER_START";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";
export const DELETE_USER_START = "DELETE_USER_START";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
export const DELETE_USER_FAILURE = "DELETE_USER_FAILURE";

type LoadSessionDoneAction = {
  type: typeof LOAD_SESSION_DONE;
} & Partial<SuccessResponse<LoginResponse>>;

interface LoginResetAction {
  type: typeof LOGIN_RESET;
}

interface LoginStartAction {
  type: typeof LOGIN_START;
}

type LoginSuccessAction = {
  type: typeof LOGIN_SUCCESS;
} & SuccessResponse<LoginResponse>;

type LoginFailureAction = {
  type: typeof LOGIN_FAILURE;
} & FailureResponse;

interface LogoutAction {
  type: typeof LOGOUT;
}

interface GetAllUsersStartAction {
  type: typeof GET_ALL_USERS_START;
}

type GetAllUsersSuccessAction = {
  type: typeof GET_ALL_USERS_SUCCESS;
} & SuccessResponse<GetAllUsersResponse>;

type GetAllUsersFailureAction = {
  type: typeof GET_ALL_USERS_FAILURE;
} & FailureResponse;

interface CreateUserStartAction {
  type: typeof CREATE_USER_START;
}

type CreateUserSuccessAction = {
  type: typeof CREATE_USER_SUCCESS;
} & SuccessResponse<CreateUserResponse>;

type CreateUserFailureAction = {
  type: typeof CREATE_USER_FAILURE;
} & FailureResponse;

interface UpdateUserStartAction {
  type: typeof UPDATE_USER_START;
}

type UpdateUserSuccessAction = {
  type: typeof UPDATE_USER_SUCCESS;
} & SuccessResponse<UpdateUserResponse>;

type UpdateUserFailureAction = {
  type: typeof UPDATE_USER_FAILURE;
} & FailureResponse;

interface DeleteUserStartAction {
  type: typeof DELETE_USER_START;
}

type DeleteUserSuccessAction = {
  type: typeof DELETE_USER_SUCCESS;
} & SuccessResponse<DeleteUserResponse>;

type DeleteUserFailureAction = {
  type: typeof DELETE_USER_FAILURE;
} & FailureResponse;

export type UsersActionTypes =
  | LoadSessionDoneAction
  | LoginResetAction
  | LoginStartAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | GetAllUsersStartAction
  | GetAllUsersSuccessAction
  | GetAllUsersFailureAction
  | CreateUserStartAction
  | CreateUserSuccessAction
  | CreateUserFailureAction
  | UpdateUserStartAction
  | UpdateUserSuccessAction
  | UpdateUserFailureAction
  | DeleteUserStartAction
  | DeleteUserSuccessAction
  | DeleteUserFailureAction;

export type AsyncUsersActionTypes = ThunkAction<void, any, unknown, Action<string>>;
