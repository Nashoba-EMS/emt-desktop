import { Schedule } from "../api/schedules.d";
import {
  SchedulesActionTypes,
  GET_ALL_SCHEDULES_START,
  GET_ALL_SCHEDULES_SUCCESS,
  GET_ALL_SCHEDULES_FAILURE,
  CREATE_SCHEDULE_START,
  CREATE_SCHEDULE_SUCCESS,
  CREATE_SCHEDULE_FAILURE,
  UPDATE_SCHEDULE_START,
  UPDATE_SCHEDULE_SUCCESS,
  UPDATE_SCHEDULE_FAILURE,
  DELETE_SCHEDULE_START,
  DELETE_SCHEDULE_SUCCESS
} from "./types/schedules";

export interface SchedulesState {
  isGettingAllSchedules: boolean;
  getAllSchedulesErrorMessage: string;
  isCreatingSchedule: boolean;
  createScheduleErrorMessage: string;
  isUpdatingSchedule: boolean;
  updateScheduleErrorMessage: string;
  isDeletingSchedule: boolean;
  deleteScheduleErrorMessage: string;

  schedules: Schedule[];
}

const initialState: SchedulesState = {
  isGettingAllSchedules: false,
  getAllSchedulesErrorMessage: "",
  isCreatingSchedule: false,
  createScheduleErrorMessage: "",
  isUpdatingSchedule: false,
  updateScheduleErrorMessage: "",
  isDeletingSchedule: false,
  deleteScheduleErrorMessage: "",

  schedules: []
};

const reducer = (state = initialState, action: SchedulesActionTypes): SchedulesState => {
  switch (action.type) {
    case GET_ALL_SCHEDULES_START:
      return {
        ...state,
        isGettingAllSchedules: true,
        getAllSchedulesErrorMessage: ""
      };
    case GET_ALL_SCHEDULES_SUCCESS:
      return {
        ...state,
        isGettingAllSchedules: false,
        schedules: action.body.schedule
      };
    case GET_ALL_SCHEDULES_FAILURE:
      return {
        ...state,
        isGettingAllSchedules: false,
        getAllSchedulesErrorMessage: action.body.error.message
      };
    case CREATE_SCHEDULE_START:
      return {
        ...state,
        isCreatingSchedule: true,
        createScheduleErrorMessage: ""
      };
    case CREATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isCreatingSchedule: false,
        schedules: [...state.schedules, action.body.schedule]
      };
    case CREATE_SCHEDULE_FAILURE:
      return {
        ...state,
        isCreatingSchedule: false,
        createScheduleErrorMessage: action.body.error.message
      };
    case UPDATE_SCHEDULE_START:
      return {
        ...state,
        isUpdatingSchedule: true,
        updateScheduleErrorMessage: ""
      };
    case UPDATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isUpdatingSchedule: false,
        schedules: [
          ...state.schedules.filter((schedule) => schedule._id !== action.body.schedule._id),
          action.body.schedule
        ]
      };
    case UPDATE_SCHEDULE_FAILURE:
      return {
        ...state,
        isUpdatingSchedule: false,
        updateScheduleErrorMessage: action.body.error.message
      };
    case DELETE_SCHEDULE_START:
      return {
        ...state,
        isDeletingSchedule: true,
        deleteScheduleErrorMessage: ""
      };
    case DELETE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isDeletingSchedule: false,
        schedules: state.schedules.filter((schedule) => schedule._id !== action.body.schedule._id)
      };
    default:
      return state;
  }
};

export default reducer;
