import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { Auth } from "../../api";

import { AuthActionTypes, LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from "../types/auth";

const loginStart = (): AuthActionTypes => ({
  type: LOGIN_START
});

const loginSuccess = (user: {}, token: string): AuthActionTypes => ({
  type: LOGIN_SUCCESS,
  user,
  token
});

const loginFailure = (errorMessage: string): AuthActionTypes => ({
  type: LOGIN_FAILURE,
  errorMessage
});

export const login = (email: string, password: string): ThunkAction<void, any, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(loginStart());

  const response = await Auth.login({ email, password });

  if (response.success) {
    dispatch(loginSuccess(response.data.user, response.data.token));
  } else {
    dispatch(loginFailure(response.errorMessage));
  }
};

export const logout = (): AuthActionTypes => {
  return {
    type: LOGOUT
  };
};
