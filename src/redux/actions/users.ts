import { UsersApi } from "../../api";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import { User } from "../../api/users.d";
import {
  UsersActionTypes,
  AsyncUsersActionTypes,
  LOAD_SESSION_DONE,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT,
  GET_ALL_USERS_START,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  CREATE_USER_START,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_START,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_START,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE
} from "../types/users";

/**
 * Create a default start action
 */
const defaultStart = (type: UsersActionTypes["type"]) => (): UsersActionTypes =>
  ({
    type
  } as UsersActionTypes);

/**
 * Create a default success action
 */
const defaultSuccess = <Response>(type: UsersActionTypes["type"]) => (
  response: SuccessResponse<Response>
): UsersActionTypes =>
  ({
    type,
    ...response
  } as UsersActionTypes);

/**
 * Create a default failure action
 */
const defaultFailure = (type: UsersActionTypes["type"]) => (response: FailureResponse): UsersActionTypes =>
  ({
    type,
    ...response
  } as UsersActionTypes);

/**
 * Finished loading from local storage
 */
const loadSessionDone = (response?: SuccessResponse<UsersApi.LoginResponse>): UsersActionTypes => ({
  type: LOAD_SESSION_DONE,
  ...response
});

/**
 * Try to load a session from local storage
 */
export const loadSession = (): AsyncUsersActionTypes => async (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token) {
    dispatch(loadSessionDone());
    return;
  }

  const response = await UsersApi.login(token);

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
export const loginReset = (): UsersActionTypes => ({
  type: LOGIN_RESET
});

const loginStart = defaultStart(LOGIN_START);
const loginSuccess = defaultSuccess<UsersApi.LoginResponse>(LOGIN_SUCCESS);
const loginFailure = defaultFailure(LOGIN_FAILURE);

/**
 * Login with the given user credentials
 */
export const login = (email: string, password: string): AsyncUsersActionTypes => async (dispatch) => {
  dispatch(loginStart());

  const response = await UsersApi.login(null, { email, password });

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
export const logout = (): UsersActionTypes => {
  // Remove the session info on signout
  localStorage.removeItem("token");

  return {
    type: LOGOUT
  };
};

const getAllUsersStart = defaultStart(GET_ALL_USERS_START);
const getAllUsersSuccess = defaultSuccess<UsersApi.GetAllUsersResponse>(GET_ALL_USERS_SUCCESS);
const getAllUsersFailure = defaultFailure(GET_ALL_USERS_FAILURE);

/**
 * Get a list of all users
 */
export const getAllUsers = (token: string): AsyncUsersActionTypes => async (dispatch) => {
  dispatch(getAllUsersStart());

  const response = await UsersApi.getAllUsers(token);

  if (response.code === 200) {
    dispatch(getAllUsersSuccess(response));
  } else {
    dispatch(getAllUsersFailure(response));
  }
};

const createUserStart = defaultStart(CREATE_USER_START);
const createUserSuccess = defaultSuccess<UsersApi.CreateUserResponse>(CREATE_USER_SUCCESS);
const createUserFailure = defaultFailure(CREATE_USER_FAILURE);

/**
 * Create a new user
 */
export const createUser = (
  token: string,
  targetEmail: string,
  userPayload: Partial<User>
): AsyncUsersActionTypes => async (dispatch) => {
  dispatch(createUserStart());

  const response = await UsersApi.createUser(token, { targetEmail, userPayload });

  if (response.code === 200) {
    dispatch(createUserSuccess(response));
  } else {
    dispatch(createUserFailure(response));
  }
};

const updateUserStart = defaultStart(UPDATE_USER_START);
const updateUserSuccess = defaultSuccess<UsersApi.UpdateUserResponse>(UPDATE_USER_SUCCESS);
const updateUserFailure = defaultFailure(UPDATE_USER_FAILURE);

/**
 * Update a user
 */
export const updateUser = (
  token: string,
  targetEmail: string,
  userPayload: Partial<User>
): AsyncUsersActionTypes => async (dispatch) => {
  dispatch(updateUserStart());

  const response = await UsersApi.updateUser(token, { targetEmail, userPayload });

  if (response.code === 200) {
    dispatch(updateUserSuccess(response));
  } else {
    dispatch(updateUserFailure(response));
  }
};

const deleteUserStart = defaultStart(DELETE_USER_START);
const deleteUserSuccess = defaultSuccess<UsersApi.DeleteUserResponse>(DELETE_USER_SUCCESS);
const deleteUserFailure = defaultFailure(DELETE_USER_FAILURE);

/**
 * Delete a user
 */
export const deleteUser = (token: string, targetEmail: string): AsyncUsersActionTypes => async (dispatch) => {
  dispatch(deleteUserStart());

  const response = await UsersApi.deleteUser(token, { targetEmail });

  if (response.code === 200) {
    dispatch(deleteUserSuccess(response));
  } else {
    dispatch(deleteUserFailure(response));
  }
};
