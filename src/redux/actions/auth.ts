import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import { Users } from "../../api";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import {
  AuthActionTypes,
  LOAD_SESSION_DONE,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT
} from "../types/auth";

/**
 * Finished loading from local storage
 */
const loadSessionDone = (response?: SuccessResponse<Users.LoginResponse>): AuthActionTypes => ({
  type: LOAD_SESSION_DONE,
  ...response
});

/**
 * Try to load a session from local storage
 */
export const loadSession = (): ThunkAction<void, any, unknown, Action<string>> => async (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token) {
    dispatch(loadSessionDone());
    return;
  }

  const response = await Users.login(token);

  if (response.code !== 200) {
    // Clear the invalid token
    localStorage.removeItem("token");

    dispatch(loadSessionDone());
    return;
  }

  localStorage.setItem("token", response.body.token);

  dispatch(loadSessionDone(response));
};

/**
 * Reset the login state
 */
export const loginReset = (): AuthActionTypes => ({
  type: LOGIN_RESET
});

/**
 * Login request has started
 */
const loginStart = (): AuthActionTypes => ({
  type: LOGIN_START
});

/**
 * Login request has succeeded
 */
const loginSuccess = (response: SuccessResponse<Users.LoginResponse>): AuthActionTypes => ({
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

  const response = await Users.login(null, { email, password });

  if (response.code === 200) {
    // Store the info in storage to use next time
    localStorage.setItem("token", response.body.token);

    dispatch(loginSuccess(response));
  } else {
    dispatch(loginFailure(response));
  }
};

/**
 * Logout the current user
 */
export const logout = (): AuthActionTypes => {
  // Remove the session info on signout
  localStorage.removeItem("token");

  return {
    type: LOGOUT
  };
};
