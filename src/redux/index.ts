import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import auth, { AuthState } from "./auth";

export interface ReduxState {
  auth: AuthState;
}

export const reducers = combineReducers({
  auth
});

export default createStore(reducers, applyMiddleware(ReduxThunk));
