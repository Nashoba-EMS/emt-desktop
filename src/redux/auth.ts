import { AuthActionTypes, LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from "./types/auth";

export interface AuthState {
  authenticated: boolean;
  isAuthenticating: boolean;
  authenticationErrorMessage: string;

  user: {};
  token: string;
}

const initialState: AuthState = {
  authenticated: false,
  isAuthenticating: false,
  authenticationErrorMessage: "",

  user: {},
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
        user: action.user,
        token: action.token
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        authenticated: false,
        isAuthenticating: false,
        authenticationErrorMessage: action.errorMessage
      };
    case LOGOUT:
      return {
        ...state,
        authenticated: false
      };
    default:
      return state;
  }
};

export default reducer;
