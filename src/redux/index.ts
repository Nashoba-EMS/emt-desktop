import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import users, { UsersState } from "./users";
import crews, { CrewsState } from "./crews";

export interface ReduxState {
  users: UsersState;
  crews: CrewsState;
}

export const reducers = combineReducers({
  users,
  crews
});

export default createStore(reducers, applyMiddleware(ReduxThunk));
