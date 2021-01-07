import { UserWithoutPassword } from "../api/users.d";
import {
  UsersActionTypes,
  LOAD_SESSION_DONE,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT
} from "./types/users";

export interface UsersState {
  loadedUser: boolean;
  authenticated: boolean;
  isAuthenticating: boolean;
  authenticationErrorMessage: string;

  user: UserWithoutPassword | null;
  token: string;
}

const initialState: UsersState = {
  loadedUser: false,
  authenticated: false,
  isAuthenticating: false,
  authenticationErrorMessage: "",

  user: null,
  token: ""
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
        authenticationErrorMessage: action.body.error.message
      };
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        user: null,
        token: ""
      };
    default:
      return state;
  }
};

export default reducer;
