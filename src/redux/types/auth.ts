export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

interface LoginStartAction {
  type: typeof LOGIN_START;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  user: {};
  token: string;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  errorMessage: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes = LoginStartAction | LoginSuccessAction | LoginFailureAction | LogoutAction;
