import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import users, { UsersState } from "./users";

export interface ReduxState {
  users: UsersState;
}

export const reducers = combineReducers({
  users
});

export default createStore(reducers, applyMiddleware(ReduxThunk));
