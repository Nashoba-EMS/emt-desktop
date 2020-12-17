import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import { AuthActionTypes, LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from "../types/auth";

const loginStart = (): AuthActionTypes => ({
  type: LOGIN_START
});

const loginSuccess = (): AuthActionTypes => ({
  type: LOGIN_SUCCESS
});

const loginFailure = (): AuthActionTypes => ({
  type: LOGIN_FAILURE
});

export const login = (email: string, password: string): ThunkAction<void, any, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(loginStart());
};

export const logout = (): AuthActionTypes => {
  return {
    type: LOGOUT
  };
};
