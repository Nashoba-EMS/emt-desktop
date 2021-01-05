import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import { Auth } from "../../api";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import { AuthActionTypes, LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from "../types/auth";

/**
 * Login request has started
 */
const loginStart = (): AuthActionTypes => ({
  type: LOGIN_START
});

/**
 * Login request has succeeded
 */
const loginSuccess = (response: SuccessResponse<Auth.LoginResponse>): AuthActionTypes => ({
  type: LOGIN_SUCCESS,
  ...response
});

/**
 * Login request has failed
 */
const loginFailure = (response: FailureResponse): AuthActionTypes => ({
  type: LOGIN_FAILURE,
  ...response
});

/**
 * Login with the given user credentials
 */
export const login = (email: string, password: string): ThunkAction<void, any, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(loginStart());

  const response = await Auth.login({ email, password });

  if (response.code === 200) {
    dispatch(loginSuccess(response));
  } else {
    dispatch(loginFailure(response));
  }
};

/**
 * Logout the current user
 */
export const logout = (): AuthActionTypes => {
  return {
    type: LOGOUT
  };
};
