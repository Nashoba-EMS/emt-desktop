import { UserWithoutPassword } from "../api/auth.d";
import { AuthActionTypes, LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from "./types/auth";

export interface AuthState {
  authenticated: boolean;
  isAuthenticating: boolean;
  authenticationErrorMessage: string;

  user: UserWithoutPassword | null;
  token: string;
}

const initialState: AuthState = {
  authenticated: false,
  isAuthenticating: false,
  authenticationErrorMessage: "",

  user: null,
  token: ""
};

const reducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
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
