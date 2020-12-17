import { AuthActionTypes, LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from "./types/auth";

export interface AuthState {
  authenticated: boolean;
  isAuthenticating: boolean;
}

const initialState: AuthState = {
  authenticated: false,
  isAuthenticating: false
};

const reducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        authenticated: false,
        isAuthenticating: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        isAuthenticating: false
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        authenticated: false,
        isAuthenticating: false
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