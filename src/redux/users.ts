import { User, UserOptionalPassword, UserWithoutPassword } from "../api/users.d";
import { getHumanTimestamp } from "../utils/datetime";
import {
  UsersActionTypes,
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
  CLEAR_USERS_SUCCESS_MESSAGE
} from "./types/users";

export interface UsersState {
  loadedUser: boolean;
  authenticated: boolean;
  isAuthenticating: boolean;
  authenticationErrorMessage: string;

  user: UserWithoutPassword | null;
  token: string;

  successMessage: string;

  isGettingAllUsers: boolean;
  getAllUsersErrorMessage: string;
  isCreatingUser: boolean;
  createUserErrorMessage: string;
  isUpdatingUser: boolean;
  updateUserErrorMessage: string;
  isDeletingUser: boolean;
  deleteUserErrorMessage: string;

  cadets: (User | UserWithoutPassword)[];
  latestCadet: UserOptionalPassword | null;
}

const initialState: UsersState = {
  loadedUser: false,
  authenticated: false,
  isAuthenticating: false,
  authenticationErrorMessage: "",

  user: null,
  token: "",

  successMessage: "",

  isGettingAllUsers: false,
  getAllUsersErrorMessage: "",
  isCreatingUser: false,
  createUserErrorMessage: "",
  isUpdatingUser: false,
  updateUserErrorMessage: "",
  isDeletingUser: false,
  deleteUserErrorMessage: "",

  cadets: [],
  latestCadet: null
};

const reducer = (state = initialState, action: UsersActionTypes): UsersState => {
  switch (action.type) {
    case LOAD_SESSION_DONE:
      return {
        ...state,
        loadedUser: true,
        authenticated: action.body?.user ? true : false,
        isAuthenticating: false,
        user: action.body?.user ?? null,
        token: action.body?.token ?? ""
      };
    case LOGIN_RESET:
      return {
        ...state,
        authenticationErrorMessage: ""
      };
    case LOGIN_START:
      return {
        ...state,
        authenticated: false,
        isAuthenticating: true,
        authenticationErrorMessage: ""
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        isAuthenticating: false,
        user: action.body.user,
        token: action.body.token
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        authenticated: false,
        isAuthenticating: false,
        authenticationErrorMessage: `${action.body.error.message} at ${getHumanTimestamp()}`
      };
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        user: null,
        token: ""
      };
    case CLEAR_USERS_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: ""
      };
    case GET_ALL_USERS_START:
      return {
        ...state,
        isGettingAllUsers: true,
        getAllUsersErrorMessage: ""
      };
    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        isGettingAllUsers: false,
        cadets: action.body.user
      };
    case GET_ALL_USERS_FAILURE:
      return {
        ...state,
        isGettingAllUsers: false,
        getAllUsersErrorMessage: `${action.body.error.message} at ${getHumanTimestamp()}`
      };
    case CREATE_USER_START:
      return {
        ...state,
        isCreatingUser: true,
        createUserErrorMessage: ""
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        successMessage: `Created user at ${getHumanTimestamp()}`,
        isCreatingUser: false,
        cadets: [...state.cadets, action.body.user],
        latestCadet: action.body.user
      };
    case CREATE_USER_FAILURE:
      return {
        ...state,
        isCreatingUser: false,
        createUserErrorMessage: `${action.body.error.message} at ${getHumanTimestamp()}`
      };
    case UPDATE_USER_START:
      return {
        ...state,
        isUpdatingUser: true,
        updateUserErrorMessage: ""
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        successMessage: `Saved user at ${getHumanTimestamp()}`,
        isUpdatingUser: false,
        cadets: [...state.cadets.filter((cadet) => cadet._id !== action.body.user._id), action.body.user],
        latestCadet: action.body.user,
        ...(action.body.user._id === state.user?._id ? { user: action.body.user } : {})
      };
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        isUpdatingUser: false,
        updateUserErrorMessage: `${action.body.error.message} at ${getHumanTimestamp()}`
      };
    case DELETE_USER_START:
      return {
        ...state,
        isDeletingUser: true,
        deleteUserErrorMessage: ""
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        successMessage: `Deleted user at ${getHumanTimestamp()}`,
        isDeletingUser: false,
        cadets: state.cadets.filter((cadet) => cadet._id !== action.body.user._id)
      };
    default:
      return state;
  }
};

export default reducer;
