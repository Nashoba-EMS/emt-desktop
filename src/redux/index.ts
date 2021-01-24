import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import users, { UsersState } from "./users";
import crews, { CrewsState } from "./crews";
import schedules, { SchedulesState } from "./schedules";

export interface ReduxState {
  users: UsersState;
  crews: CrewsState;
  schedules: SchedulesState;
}

export const reducers = combineReducers({
  users,
  crews,
  schedules
});

export default createStore(reducers, applyMiddleware(ReduxThunk));
