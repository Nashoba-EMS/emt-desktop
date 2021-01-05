import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import { LoginResponse } from "../../api/users";

export const LOGIN_RESET = "LOGIN_RESET";
export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

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

export type AuthActionTypes =
  | LoginResetAction
  | LoginStartAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction;
